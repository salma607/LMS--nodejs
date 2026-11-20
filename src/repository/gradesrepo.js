import {Grade} from "../models/index.js";
import AbstractRepository from "./abstractrepo.js";

const GradeRepository = new AbstractRepository(Grade);

export default GradeRepository;