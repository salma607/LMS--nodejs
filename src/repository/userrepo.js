import {User} from "../models/index.js";
import AbstractRepository from "./abstractrepo.js";

const userRepository = new AbstractRepository(User);

export default userRepository;