import {Metadata} from '@grpc/grpc-js';

import createCredentials from './createCredentials';
import {GRPCPlugin, ServiceDefinition} from './lib/types';
import auth from './services/auth';
import pfs from './services/pfs';
import pps from './services/pps';
import projects from './services/projects';
import {homedir} from 'os';
import {readFileSync, existsSync} from 'fs';
import {URL} from 'url';
// @ts-ignore-next-line
import certifi from 'certifi';

const envConfig = 'PACH_CONFIG';
const spoutConfig = '/pachctl/config.json';
const localConfig = `${homedir()}/.pachyderm/config.json`;

interface ClientArgs {
  pachdAddress?: string;
  authToken?: string;
  projectId?: string;
  plugins?: GRPCPlugin[];
  ssl?: boolean;
}

const attachPlugins = <T extends ServiceDefinition>(
  service: T,
  plugins: GRPCPlugin[] = [],
): T => {
  const onCallObservers = plugins.flatMap((p) => (p.onCall ? [p.onCall] : []));
  const onCompleteObservers = plugins.flatMap((p) =>
    p.onCompleted ? [p.onCompleted] : [],
  );
  const onErrorObservers = plugins.flatMap((p) =>
    p.onError ? [p.onError] : [],
  );

  const serviceProxyHandler: ProxyHandler<T> = {
    // TS doesn't support symbol indexing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get: (service, requestName: any) => {
      // const requestName = String(key);
      // technically, a key can be a symbol
      const originalHandler = service[requestName];

      return async (...args: never[]) => {
        try {
          onCallObservers.forEach((cb) => cb({requestName}));
          const result = await originalHandler(...args);
          onCompleteObservers.forEach((cb) => cb({requestName}));
          return result;
        } catch (e) {
          onErrorObservers.forEach((cb) => cb({error: e, requestName}));
          throw e;
        }
      };
    },
  };

  return new Proxy(service, serviceProxyHandler);
};

class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
  }
}

class BadClusterDeploymentId extends ConfigError {
  expectedDeploymentId: string;
  actualDeploymentId: string;

  constructor(
    message: string,
    expectedDeploymentId: string,
    actualDeploymentId: string,
  ) {
    super(message);
    this.message = message;
    this.expectedDeploymentId = expectedDeploymentId;
    this.actualDeploymentId = actualDeploymentId;
  }
}

const checkForConfig = () => {
  let jc = {};

  jc = checkPachConfigEnvVar();
  if (Object.keys(jc).length !== 0) {
    return jc;
  }
  jc = checkPachConfigSpout();
  if (Object.keys(jc).length !== 0) {
    return jc;
  }
  jc = checkPachConfigLocal();
  if (Object.keys(jc).length !== 0) {
    return jc;
  }

  console.log('no config found, proceeding with default behaviour');

  return jc;
};

const checkPachConfigEnvVar = () => {
  let jc = {};
  if (process.env[envConfig]) {
    // found a pach config location through env vars
    const pachEnvConf = readFileSync(process.env[envConfig] || '', {
      encoding: 'utf8',
      flag: 'r',
    });
    jc = JSON.parse(pachEnvConf);
  }
  return jc;
};

const checkPachConfigSpout = () => {
  let jc = {};
  if (existsSync(spoutConfig)) {
    const pachSpoutConf = readFileSync(spoutConfig, {
      encoding: 'utf8',
      flag: 'r',
    });
    jc = JSON.parse(pachSpoutConf);
  }
  return jc;
};

const checkPachConfigLocal = () => {
  let jc = {};
  if (existsSync(localConfig)) {
    const pachLocalConf = readFileSync(localConfig, {
      encoding: 'utf8',
      flag: 'r',
    });
    jc = JSON.parse(pachLocalConf);
  }
  return jc;
};

const parseAddress = (pachdAddress: string) => {
  if (!pachdAddress.includes('://')) {
    pachdAddress = `grpc://${pachdAddress}`;
  }
  const parsedPachdAddress = new URL(pachdAddress);
  if (
    !['grpc', 'grpcs', 'http', 'https'].includes(parsedPachdAddress.protocol)
  ) {
    throw new Error(
      `unrecognized pachd address scheme ${parsedPachdAddress.protocol}`,
    );
  }
  if (
    parsedPachdAddress.pathname !== '' &&
    parsedPachdAddress.search !== '' &&
    parsedPachdAddress.hash !== ''
  ) {
    throw new Error(`invalid pachd address`);
  }
  if (
    parsedPachdAddress.username !== '' &&
    parsedPachdAddress.password !== ''
  ) {
    throw new Error(`invalid pachd address`);
  }
  return parsedPachdAddress;
};

const getActiveContext = (config: any) => {
  let activeContext;
  let context;
  if (config['v2']['active_context'] === undefined) {
    throw new ConfigError('no active context');
  } else {
    activeContext = config['v2']['active_context'];
  }
  if (config['v2']['contexts'][activeContext] === undefined) {
    throw new ConfigError(`missing active context '${activeContext}'`);
  } else {
    context = config['v2']['contexts'][activeContext];
  }

  return context;
};

const parseConfig = (config: any) => {
  const context = getActiveContext(config);

  const authToken = context['session_token'];
  let rootCerts = context['server_cas'];
  const transactionId = context['active_transaction'];

  let portForwarders;
  let pachdPort;

  let pachdAddress = context['pachd_address'];
  if (pachdAddress === undefined) {
    portForwarders = context['port_forwarders'] || {};
    pachdPort = portForwarders['pachd'] || 30650;
    pachdAddress = `grpc://localhost:${pachdPort}`;
    rootCerts = null;
  }

  const parsedPachdAddress = parseAddress(pachdAddress);

  const host = parsedPachdAddress.hostname;
  const port = parsedPachdAddress.port;
  let tls;
  if (
    parsedPachdAddress.protocol === 'grpcs' ||
    parsedPachdAddress.protocol === 'https'
  ) {
    tls = true;
  } else {
    tls = false;
  }

  return {host, port, pachdAddress, authToken, rootCerts, transactionId, tls};
};

const newFromPachdAddress = (
  pachdAddress: string,
  authToken: string,
  rootCerts: string,
  transactionId: string,
) => {
  const parsedPachdAddress = parseAddress(pachdAddress);
  let tls;
  if (
    parsedPachdAddress.protocol === 'grpcs' ||
    parsedPachdAddress.protocol === 'https'
  ) {
    tls = true;
  } else {
    tls = false;
  }
  return {
    host: parsedPachdAddress.host,
    port: parsedPachdAddress.port,
    authToken,
    rootCerts,
    transactionId,
    tls,
    useDefaultHost: false,
  };
};

const newFromConfig = (userConfig: any) => {
  if (userConfig === undefined || Object.keys(userConfig).length === 0) {
    throw new ConfigError('no config object found');
  }
  const config = JSON.parse(userConfig);
  const {pachdAddress, authToken, rootCerts, transactionId} =
    parseConfig(userConfig);

  const returnableClientArgs = newFromPachdAddress(
    pachdAddress,
    authToken,
    rootCerts,
    transactionId,
  );

  const context = getActiveContext(config);
  const expectedDeploymentId = context['cluster_deployment_id'];
  if (expectedDeploymentId) {
    const inspectorClient = client({
      pachdAddress: `${returnableClientArgs.host}:${returnableClientArgs.port}`,
    });
    let clusterInfo;
    // TODO: admin proto plumbing
    // clusterInfo = inspectorClient.admin().inspectClient()
    if (clusterInfo && clusterInfo['deployment_id'] !== expectedDeploymentId) {
      throw new BadClusterDeploymentId(
        `connected to the wrong cluster ('${expectedDeploymentId}' vs '${clusterInfo['deployment_id']}')`,
        expectedDeploymentId,
        clusterInfo['deployment_id'],
      );
    }
  }

  return returnableClientArgs;
};

const newInCluster = (authToken: string, transactionId: string) => {
  let host;
  let port;
  if (
    process.env.PACHD_PEER_SERVICE_HOST &&
    process.env.PACHD_PEER_SERVICE_PORT
  ) {
    host = process.env.PACHD_PEER_SERVICE_HOST;
    port = parseInt(process.env.PACHD_PEER_SERVICE_PORT);
  } else {
    host = process.env.PACHD_SERVICE_HOST;
    port = parseInt(process.env.PACHD_SERVICE_PORT || '30650');
  }

  return {host, port, authToken, transactionId, useDefaultHost: false};
};

const clientFactory = (
  host: string = '',
  port: number,
  authToken: string = '',
  rootCerts: string = '',
  transactionId: string = '',
  ssl: boolean = false,
  useDefaultHost: boolean = true,
) => {
  let configHost,
    configPort,
    configAuthToken,
    configRootCerts,
    configTransactionId,
    configSsl;
  if (host !== '' && port !== undefined && useDefaultHost) {
    const config = checkForConfig();
    if (Object.keys(config).length !== 0) {
      const {host, port, authToken, rootCerts, transactionId, tls} =
        parseConfig(config);
      configHost = host;
      configPort = port;
      configAuthToken = authToken;
      configRootCerts = rootCerts;
      configTransactionId = transactionId;
      configSsl = tls;
    }
  }

  host = configHost !== '' ? configHost || host : 'localhost';
  port = configPort !== undefined ? parseInt(configPort) || port : 30650;

  if (configAuthToken === undefined || configAuthToken === '') {
    authToken = process.env.PACH_PYTHON_AUTH_TOKEN || configAuthToken;
  }

  if (configSsl === undefined) {
    ssl = rootCerts !== undefined || rootCerts !== '' ? false : true;
  }

  if (configSsl && (rootCerts !== '' || rootCerts === undefined)) {
    rootCerts = readFileSync('certifi/cacert.pem', {
      encoding: 'utf8',
      flag: 'r',
    });
  }

  const pachdAddress = `${host}:${port}`;
  if (
    (authToken !== '' || authToken === undefined) &&
    process.env.PACH_PYTHON_OIDC_TOKEN
  ) {
    client({pachdAddress})
      .auth()
      .authenticate(process.env.PACH_PYTHON_OIDC_TOKEN)
      .then((authn) => (authToken = authn));
  }
};

const client = ({
  pachdAddress = '',
  authToken = '',
  projectId = '',
  plugins = [],
  ssl = true,
}: ClientArgs) => {
  const channelCredentials = createCredentials(ssl);

  const credentialMetadata = new Metadata();
  credentialMetadata.add('authn-token', authToken);
  credentialMetadata.add('project-id', projectId);

  let pfsService: ReturnType<typeof pfs> | undefined;
  let ppsService: ReturnType<typeof pps> | undefined;
  let authService: ReturnType<typeof auth> | undefined;
  let projectsService: ReturnType<typeof projects> | undefined;

  // NOTE: These service clients are singletons, as we
  // don't want to create a new instance of APIClient for
  // every call stream in a transaction.
  const services = {
    pfs: () => {
      if (pfsService) return pfsService;

      pfsService = attachPlugins(
        pfs({
          pachdAddress,
          channelCredentials,
          credentialMetadata,
        }),
        plugins,
      );
      return pfsService;
    },
    pps: () => {
      if (ppsService) return ppsService;

      ppsService = attachPlugins(
        pps({
          pachdAddress,
          channelCredentials,
          credentialMetadata,
        }),
        plugins,
      );
      return ppsService;
    },
    auth: () => {
      if (authService) return authService;

      authService = attachPlugins(
        auth({
          pachdAddress,
          channelCredentials,
          credentialMetadata,
        }),
        plugins,
      );
      return authService;
    },
    projects: () => {
      if (projectsService) return projectsService;

      projectsService = attachPlugins(
        projects({
          pachdAddress,
          channelCredentials,
          credentialMetadata,
        }),
        plugins,
      );
      return projectsService;
    },
  };

  return services;
};

export default client;
