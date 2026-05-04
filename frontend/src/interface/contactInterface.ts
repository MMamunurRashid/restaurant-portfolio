export type ISocial = {
  icon: string;
  url: string;
};

export type IOfficeHours = {
  day: string;
  hours: string;
};

export type IContact = {
  title: string;
  subTitle: string;
  email: string;
  phone: string;
  address: string;
  googleMapLink?: string;
  whatsappLink: string;
  messengerLink?: string;
  socials: ISocial[];
  officeHours: IOfficeHours[];
};
