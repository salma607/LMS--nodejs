import {Assignment} from "../models/index.js";
import AbstractRepository from "./abstractrepo.js";

const AssigmentRepository = new AbstractRepository(Assignment);

export default AssigmentRepository;
