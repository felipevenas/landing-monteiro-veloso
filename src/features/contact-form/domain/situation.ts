export const VEHICLE_SITUATIONS = [
  { value: 'apreendido', label: 'O veículo já foi apreendido' },
  { value: 'notificacao', label: 'Recebi notificação de busca e apreensão' },
  { value: 'atraso', label: 'Estou com parcelas atrasadas' },
  { value: 'outro', label: 'Outra situação' },
] as const;

export type VehicleSituation = (typeof VEHICLE_SITUATIONS)[number]['value'];

export function isVehicleSituation(value: string): value is VehicleSituation {
  return VEHICLE_SITUATIONS.some((situation) => situation.value === value);
}

export function situationLabel(value: VehicleSituation): string {
  return VEHICLE_SITUATIONS.find((situation) => situation.value === value)?.label ?? value;
}
