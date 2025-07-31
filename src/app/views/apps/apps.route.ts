import type { Route } from "@angular/router";
import { ChatComponent } from "./chat/chat.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { EmailComponent } from "./email/email.component";
import { FileManagerComponent } from "./file-manager/file-manager.component";

export const APPS_ROUTES: Route[] = [
  {
    path: 'chat',
    component: ChatComponent,
    data: { title: 'Chat' }
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    data: { title: 'Calendar' }
  },
  {
    path: 'email',
    component: EmailComponent,
    data: { title: 'Email' }
  },
  {
    path: 'file-manager',
    component: FileManagerComponent,
    data: { title: 'File Manager' }
  },
]