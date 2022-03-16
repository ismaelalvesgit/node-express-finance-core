import { newsService } from "../services";
import catchAsync from "../utils/catchAsync";

export const find = catchAsync(async (req, res) =>{
    const data = await newsService.findNews(req.query);
    res.json(data);
});