export type IContact = {
  title: string;
  subTitle: string;
  email: string;
  phone: string;
  address: string;
  whatsappLink?: string;
  messengerLink?: string;
  googleMapLink?: string;
  socials: {
    icon: string;
    url: string;
  }[];
  officeHours: {
    day: string;
    hours: string;
  }[];
};
