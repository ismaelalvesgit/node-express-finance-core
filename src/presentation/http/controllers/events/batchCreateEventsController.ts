import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { IEventsService } from "@domain/events/types/IEventsService";
import { StatusCodes } from "http-status-codes";

@injectable()
export default class BatchCreateEventsController implements IBaseController {

    constructor(
        @inject(tokens.EventsService)
        private eventsService: IEventsService,
    ) { }

    async handler(req: Request, res: Response) {
        await this.eventsService.createBatch(req.body);
        res.status(StatusCodes.CREATED).json(req.__("Events.create"));
    }
}