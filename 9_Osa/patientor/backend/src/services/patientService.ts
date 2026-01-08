import { v1 as uuid } from "uuid";
import patients from "../../data/patients";
import { Patient, NoSsnPatient, NewPatient } from "../types";

const patientsList: Patient[] = patients.map(o => {
  const object = o as Patient;
  object.entries = object.entries || [];
  return object;
});

const getPatients = (): Patient[] => {
  return patientsList;
};

const getNoSsnPatients = (): NoSsnPatient[] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return patientsList.map(({ ssn, entries, ...patient }) => patient);
};

const getPatientById = ( id: string ): Patient | undefined => {
  return patientsList.find(patient => patient.id === id);
};

const addPatient = ( entry: NewPatient ): Patient => {
  const newPatient = {
    ...entry,
    id: uuid(),
    entries: [],
  };
  patientsList.push(newPatient);
  return newPatient;
};

export default {
  getPatients,
  getNoSsnPatients,
  getPatientById,
  addPatient
};