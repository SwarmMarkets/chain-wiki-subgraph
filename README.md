# trade-subgraph

This repo was forked from balancer (here)[https://github.com/balancer-labs/balancer-subgraph] where you can find further information.

## Getting started

1. Install dependencies:

```bash
$ yarn install
```

2. Create an `.env` file in the root of the project and add the following:

```
NETWORK=mainnet
```

3. Generate the subgraph declaration:

```bash
$ yarn _:generate:config
```

4. Start your local subgraph node (required installing Docker on your machine):

```bash
$ yarn dev
```

> This assumes you have a local RPC node running on port 8545. If you want to use a different port, you can set it in the `docker-compose.yml` file via the `ethereum` parameter following the `<NETWORK_NAME>:<ETHEREUM_RPC_URL>` schema.

5. Create your local subgraph:

```bash
$ yarn create-local
```

6. Deploy your local subgraph:

```bash
$ yarn deploy-local
```

## Deployments

We deploy the subgraph to the following networks:

- Ethereum mainnet: https://thegraph.com/hosted-service/subgraph/swarmmarkets/trade-mainnet
- Polygon mainnet: https://thegraph.com/hosted-service/subgraph/swarmmarkets/trade-polygon
- Goerli testnet: https://thegraph.com/hosted-service/subgraph/swarmmarkets/trade-goerli
- Mumbai testnet: https://thegraph.com/hosted-service/subgraph/swarmmarkets/trade-mumbai
- Rinkeby testnet `Deprecated`: ~~https://thegraph.com/hosted-service/subgraph/swarmmarkets/trade-rinkeby~~

On top of them, each deployment has a unique beta subgraph than can be used to test features before deploying them to the previously listed stable subgraphs:

- Ethereum mainnet beta: https://thegraph.com/hosted-service/subgraph/swarmmarkets/trade-mainnet-beta
- Polygon mainnet beta: https://thegraph.com/hosted-service/subgraph/swarmmarkets/trade-polygon-beta
- Goerli testnet beta: https://thegraph.com/hosted-service/subgraph/swarmmarkets/trade-goerli-beta
- Mumbai testnet beta: https://thegraph.com/hosted-service/subgraph/swarmmarkets/trade-mumbai-beta
- Rinkeby testnet beta `Deprecated`: ~~https://thegraph.com/hosted-service/subgraph/swarmmarkets/trade-rinkeby-beta~~
