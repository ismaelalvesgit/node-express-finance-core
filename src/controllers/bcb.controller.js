import { bcbService } from "../services";
import catchAsync from "../utils/catchAsync";

export const selic = catchAsync(async (req, res) =>{
    const data = await bcbService.selic(req.query);
    res.json(data);
});

export const inflaction = catchAsync(async (req, res) =>{
    const data = await bcbService.inflaction(req.query);
    res.json(data);
});

export const inflactionIndicator = catchAsync(async (req, res) =>{
    const data = await bcbService.inflactionIndicator();
    res.json(data);
});

export const ibovespa = catchAsync(async (req, res) =>{
    const data = await bcbService.ibovespa(req.query["type"]);
    res.json(data);
});

export const ifix = catchAsync(async (req, res) =>{
    const data = await bcbService.ifix(req.query["type"]);
    res.json(data);
});

export const ipca = catchAsync(async (req, res) =>{
    const data = await bcbService.ipca(req.query["type"]);
    res.json(data);
});

export const cdi = catchAsync(async (req, res) =>{
    const data = await bcbService.cdi(req.query["type"]);
    res.json(data);
});

export const news = catchAsync(async (req, res) =>{
    const data = await bcbService.news();
    res.json(data);
});