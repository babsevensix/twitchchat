import { DocumentReference } from "@angular/fire/firestore";
import { UserProfile } from "./userprofile.model";

export interface Message{
    userSent: DocumentReference<UserProfile>;
    message: string;
    messageSentOn: Date;
}