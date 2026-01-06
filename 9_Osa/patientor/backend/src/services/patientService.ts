import { v1 as uuid } from "uuid";
import patients from "../../data/patients";
import { Patient, NoSsnPatient, NewPatient } from "../types";

const patientsList: Patient[] = patients as Patient[];

const getPatients = (): Patient[] => {
  return patientsList;
};

const getNoSsnPatients = (): NoSsnPatient[] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return patientsList.map(({ ssn, ...patient }) => patient);
};

const addPatient = ( entry: NewPatient ): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry
  };
  patientsList.push(newPatient);
  return newPatient;
};

export default {
  getPatients,
  getNoSsnPatients,
  addPatient
};