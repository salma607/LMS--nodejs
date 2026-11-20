import {Student} from "../models/index.js";
import AbstractRepository from "./abstractrepo.js";

const studentRepository = new AbstractRepository(Student);