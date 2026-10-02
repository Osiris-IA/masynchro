export interface Alarm {
  id: string
  userId: string
  wakeUpTime: string
  arrivalTime: string
  isActive: boolean
}

export interface RoutineStep {
  id: string
  label: string
  durationMinutes: number
  order: number
}

export interface WeatherData {
  temperature: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy'
  humidity: number
  windSpeed: number
  advice: string
  extraMinutes: number
}

export interface TransportData {
  durationMinutes: number
  status: 'normal' | 'delayed' | 'disrupted'
  message: string
}

export interface BriefingRequest {
  arrivalTime: string
  homeLat: number
  homeLon: number
  workLat: number
  workLon: number
}

export interface BriefingResponse {
  weather: WeatherData
  transport: TransportData
}
