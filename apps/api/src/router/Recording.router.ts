import { Router } from "express";
import { IGenericRequestBody, IGenericResponse } from "../utils";
import { RecordingModels, RecordingController } from "@sniffer/domain";
const recordingRouter = Router();

recordingRouter.post(
  "/generate-url",
  async (
    req: IGenericRequestBody<RecordingModels.GenerateUrl.IRequestDTO>,
    res: IGenericResponse<RecordingModels.GenerateUrl.IResponseDTO>
  ) => {
    const recordingController = new RecordingController();
    const recording = await recordingController.generateUrl({
      networkRecording: req.body.networkRecording,
      screenRecording: req.body.screenRecording,
    });

    res.json(recording);
  }
);

recordingRouter.get("/get/:id", async (req, res) => {
  const recordingController = new RecordingController();
  try {
    const recording = await recordingController.getRecording({
      id: req.params.id,
    });

    res.json(recording);
  } catch (error) {
    res.status(404).send("Recording not found");
  }
});

export default recordingRouter;
