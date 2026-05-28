import { appSchema } from "@nozbe/watermelondb";
import { PlayerSchema } from "./PlayerSchema";
import { MatchSchema } from "./MatchSchema";
import { MatchPlayerSchema } from "./MatchPlayerSchema";

export default appSchema({
  version: 1,
  tables: [
    PlayerSchema,
    MatchSchema,
    MatchPlayerSchema,
  ]
});