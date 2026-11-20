import {Notification} from "../models/index.js";
import AbstractRepository from "./abstractrepo.js";

const NotificationRepository = new AbstractRepository(Notification);

export default NotificationRepository;