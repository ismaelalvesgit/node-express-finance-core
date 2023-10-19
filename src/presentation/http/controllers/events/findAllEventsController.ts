import { Response, Request } from "express";
import { IBaseController } from "../../types/IRouter";
import { inject, injectable } from "tsyringe";
import { tokens } from "@di/tokens";
import { IEventsService } from "@domain/events/types/IEventsService";
import Common from "@helpers/Common";

@injectable()
export default class FindAllEventsController implements IBaseController {

    constructor(
        @inject(tokens.EventsService)
        private eventsService: IEventsService,
    ) { }

    async handler(req: Request, res: Response) {
        const filterBy = Common.getFilterBy(req);
        const data = await this.eventsService.find({
            ...req.query,
            filterBy
        });
        res.json(data);
    }
}