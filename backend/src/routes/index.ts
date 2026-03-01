import { Router } from 'express';
const router = Router();
import { userRoute } from '../modules/user/userRoute';
import { authRoute } from '../modules/auth/authRoute';

import { seoRoute } from '../modules/seo/seoRoute';
import { bannerRoute } from '../modules/banner/bannerRoute';
import { contactRoute } from '../modules/contact/contactRoute';
import { popupNoticeRoute } from '../modules/popupNotification/popupNoticeRoute';
import { blogRoute } from '../modules/blog/blogRoute';
import { generalSettingRoute } from '../modules/generalSetting/generalSettingRoute';
import { gtmRoute } from '../modules/gtm/gtmRoute';
import { aboutRoute } from '../modules/about/aboutRoute';
import { messagesRoute } from '../modules/message/messageRoute';
import { teamRoute } from '../modules/team/teamRoute';
import { teamCategoryRoute } from '../modules/teamCategory/teamCategoryRoute';
import { appointmentRoute } from '../modules/appointment/appointmentRoute';
import { termConditionRoute } from '../modules/termCondition/termConditionRoute';
import { privacyPolicyRoute } from '../modules/privacyPolicy/privacyPolicyRoute';
import { serviceRoute } from '../modules/service/serviceRoute';
import { campaignRoute } from '../modules/campaign/campaignRoute';
import { testimonialRoute } from '../modules/testimonial/testimonialRoute';

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },

  {
    path: '/service',
    route: serviceRoute,
  },
  {
    path: '/about',
    route: aboutRoute,
  },
  {
    path: '/team-category',
    route: teamCategoryRoute,
  },
  {
    path: '/team',
    route: teamRoute,
  },

  {
    path: '/contact',
    route: contactRoute,
  },
  {
    path: '/message',
    route: messagesRoute,
  },
  {
    path: '/appointment',
    route: appointmentRoute,
  },
  {
    path: '/blogs',
    route: blogRoute,
  },

  // banner
  {
    path: '/banner',
    route: bannerRoute,
  },

  // popup notice
  {
    path: '/notice',
    route: popupNoticeRoute,
  },

  // privacy policy
  {
    path: '/privacy-policy',
    route: privacyPolicyRoute,
  },
  // term condition
  {
    path: '/term-condition',
    route: termConditionRoute,
  },

  // general setting
  {
    path: '/general-setting',
    route: generalSettingRoute,
  },
  {
    path: '/campaign',
    route: campaignRoute,
  },
  {
    path: '/testimonial',
    route: testimonialRoute,
  },
  {
    path: '/gtm',
    route: gtmRoute,
  },
  {
    path: '/seo',
    route: seoRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
