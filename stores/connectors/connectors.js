import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";

const POLLING_INTERVAL = 10000

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42]
});

export const network = new NetworkConnector({
  urls: { [1]: 'https://ethmainnet.anyswap.exchange' },
  pollingInterval: POLLING_INTERVAL * 3
})
