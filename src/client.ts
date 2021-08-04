import {Metadata} from '@grpc/grpc-js';

import createCredentials from './createCredentials';
import {GRPCPlugin, ServiceDefinition} from './lib/types';
import auth from './services/auth';
import pfs from './services/pfs';
import pps from './services/pps';
import projects from './services/projects';
import {homedir} from 'os';
import {readFileSync, existsSync, read} from 'fs';

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
