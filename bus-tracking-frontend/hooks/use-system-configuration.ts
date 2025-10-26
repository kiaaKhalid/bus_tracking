import useSWR from "swr"
import { SystemConfigurationService } from "@/lib/services/system-configuration-service"
import type { CameraFormData, StationFormData } from "@/lib/schemas/system-configuration"

export function useSystemConfiguration() {
  // Cameras
  const {
    data: camerasData,
    mutate: mutateCameras,
    isLoading: camerasLoading,
    error: camerasError,
  } = useSWR("/cameras", () => SystemConfigurationService.getCameras())

  const cameras = camerasData?.cameras || []

  const createCamera = async (data: CameraFormData) => {
    try {
      const newCamera = await SystemConfigurationService.createCamera(data)
      await mutateCameras()
      return newCamera
    } catch (error) {
      throw error
    }
  }

  const updateCamera = async (id: string, data: Partial<CameraFormData>) => {
    try {
      const updated = await SystemConfigurationService.updateCamera(id, data)
      await mutateCameras()
      return updated
    } catch (error) {
      throw error
    }
  }

  const deleteCamera = async (id: string) => {
    try {
      await SystemConfigurationService.deleteCamera(id)
      await mutateCameras()
    } catch (error) {
      throw error
    }
  }

  // Station
  const {
    data: stationData,
    mutate: mutateStation,
    isLoading: stationLoading,
    error: stationError,
  } = useSWR("/station", () => SystemConfigurationService.getStationInfo())

  const station = stationData?.station

  const updateStation = async (data: StationFormData) => {
    try {
      const updated = await SystemConfigurationService.updateStationInfo(data)
      await mutateStation()
      return updated
    } catch (error) {
      throw error
    }
  }

  return {
    // Cameras
    cameras,
    camerasLoading,
    camerasError,
    createCamera,
    updateCamera,
    deleteCamera,
    mutateCameras,
    // Station
    station,
    stationLoading,
    stationError,
    updateStation,
    mutateStation,
  }
}
