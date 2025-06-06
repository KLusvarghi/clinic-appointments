export interface TimeSlot {
  value: string;
  available: boolean;
  label: string;
}

export interface GetAvailableTimesResponse {
  data: TimeSlot[];
}

// Também exportando o tipo do retorno da função para uso em outros lugares
export type GetAvailableTimesReturn = Promise<GetAvailableTimesResponse>;
