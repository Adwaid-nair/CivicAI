import { Authority } from "./types";

export const APP_NAME = "CivicAI";

export const AUTHORITIES: Authority[] = [
  {
    id: "auth_muni",
    name: "City Municipal Corporation",
    type: "Corporation",
    email: "commissioner@citycorp.gov",
    whatsapp: "15550109999"
  },
  {
    id: "auth_water",
    name: "Metro Water Supply Board",
    type: "Water Board",
    email: "helpdesk@metrowater.gov",
    whatsapp: "15550123456"
  },
  {
    id: "auth_elec",
    name: "State Electricity Board",
    type: "Electricity Board",
    email: "outage@electricity.gov",
    whatsapp: "15550198888"
  },
  {
    id: "auth_police",
    name: "Traffic Police Dept",
    type: "Municipality",
    email: "traffic@police.gov",
    whatsapp: "15550112222"
  }
];

export const MOCK_IMAGES = {
  POTHOLE: "https://picsum.photos/id/1015/800/600", // River/nature but generic placeholder
  GARBAGE: "https://picsum.photos/id/93/800/600",
  STREETLIGHT: "https://picsum.photos/id/102/800/600",
};

export const AUTO_ESCALATION_MINUTES = 2; // Fast for demo purposes
