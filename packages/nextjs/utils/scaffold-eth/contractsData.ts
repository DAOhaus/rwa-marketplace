import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import scaffoldConfig from "~~/scaffold.config";
import { contracts } from "~~/utils/scaffold-eth/contract";

export function getAllContracts(chainId?: number) {
  const contractsData = contracts?.[chainId || scaffoldConfig.targetNetworks[0].id];
  return contractsData ? contractsData : {};
}

export function useAllContracts(id?: number | null) {
  const { targetNetwork } = useTargetNetwork();
  const contractsData = contracts?.[id || targetNetwork?.id];
  return contractsData ? contractsData : {};
}
