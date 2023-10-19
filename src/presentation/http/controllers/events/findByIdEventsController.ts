import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { IEventsService } from "@domain/events/types/IEventsService";

@injectable()
export default class FindByIdEventsController implements IBaseController {

    constructor(
        @inject(tokens.EventsService)
        private eventsService: IEventsService,
    ) { }

    async handler(req: Request, res: Response) {
        const id = req.params.id;
        const data = await this.eventsService.findById(id);
        res.json(data);
    }
}