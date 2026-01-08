import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Patient } from "../../types";
import { apiBaseUrl } from "../../constants";

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        if (id) {
          const { data: patientFromApi } = await axios.get<Patient>(
            `${apiBaseUrl}/patients/${id}`
          );
          setPatient(patientFromApi);
        }
      } catch (e) {
        console.error(e);
      }
    };
    
    void fetchPatient();
  }, [id]);

  if (!patient) return <div>loading...</div>;

  return (
    <div>
      <h2>{patient.name}</h2>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>
      <div>gender: {patient.gender}</div>
      {patient.entries.length > 0 && (
        <h4 style={{ marginTop: "55px", marginBottom: "0em" }}>
          Entries:
        </h4>
      )}
      {patient.entries.map(entry => (
        <div key={entry.id} >
          <p>{entry.date} <i>{entry.description}</i></p>
          {entry.diagnosisCodes && (
            <ul>
              {entry.diagnosisCodes.map(code => (
                <li key={code}>{code}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default PatientPage;