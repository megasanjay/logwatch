import { defineStore } from "pinia";

export const useApplicationStore = defineStore("Application", () => {
  const applications = ref<Application[]>([]);

  const getApplications = () => {
    return applications;
  };

  const setApplications = (newApplications: Application[]) => {
    applications.value = newApplications;
  };

  const addApplication = (application: Application) => {
    applications.value.push(application);
  };

  return {
    applications,
    addApplication,
    setApplications,
    getApplications,
  };
});
