import express from "express";
import patientService from "../services/patientService";
import toNewPatient from "../utils";
import { z } from "zod";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patientService.getNoSsnPatients());
});

router.get("/:id", (req, res) => {
  const patient = patientService.getPatientById(req.params.id);
  if (patient) {
    res.json(patient);
  } else {
    res.status(404).send({ error: "Patient not found" });
  }
});

router.post("/", (req, res) => {

  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
      return;
    } else if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send({ errorMessage });
  }
});

export default router;