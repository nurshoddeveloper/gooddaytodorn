
export function getGlyphByName(name) {
  if (name.startsWith('gd-icon-')) name = name.substr(8);
  return glyphs[name] || glyphs.file;
}

const glyphs = {

  // from src/skin/common/gd-icons/gd-icons.scss

  'activity': 0x57,
  'tasks': 0x59,
  'arrow-left': 0x30,
  'export': 0x61,
  'arrow-down': 0x62,
  'arrow-right': 0x63,
  'people': 0x67,
  'my-work': 0x68,
  'projects': 0x69,
  'calendar': 0x65,
  'favorite': 0x6b,
  'organization': 0x6e,
  'task': 0x6f,
  'notification': 0x70,
  'add': 0x6c,
  'event-project-event': 0x71,
  'event-project-milestone': 0x73,
  'arrow-long-left': 0x74,
  'reports': 0x6a,
  'arrow-long-down': 0x72,
  'arrow-long-right': 0x75,
  'arrow-long-up': 0x76,
  'event-personal-travel': 0x77,
  'event-personal-vacation': 0x79,
  'event-company-event': 0x7a,
  'event-company-holiday': 0x41,
  'event-project-payment': 0x43,
  'task-bug': 0x44,
  'event-project-deadline': 0x45,
  'event-project-created': 0x46,
  'status-menu': 0x47,
  'task-idea': 0x49,
  'emergency': 0x4b,
  'status2': 0x66,
  'time': 0x42,
  'edit': 0x47,
  'delete': 0x4d,
  'favorites-selected': 0x4a,
  'search': 0x4c,
  'view-tiles': 0x4f,
  'more': 0x51,
  'big-timeline': 0x52,
  'big-notification': 0x53,
  'event-personal-sick-leave': 0x78,
  'user': 0x38,
  'status-board': 0x48,
  'comment': 0x39,
  //'help': 0x4e,
  'big-calendar': 0x37,
  'big-mail': 0x55,
  'big-departments': 0x58,
  'big-offices': 0x22,
  'big-profile-organization': 0x5a,
  'big-users': 0x24,
  'big-projects': 0x31,
  'big-profile-user': 0x56,
  'big-status': 0x33,
  'big-task': 0x34,
  'big-advanced': 0x35,
  'big-profile-project': 0x36,
  'big-password': 0x25,
  'eye': 0x54,
  'pin': 0x26,
  'actions': 0x27,
  'watermark-calendar': 0x23,
  'watermark-project': 0x28,
  'watermark-task': 0x29,
  'watermark-user': 0x2a,
  'someday': 0x2b,
  'eye-disabled': 0x6d,
  'notification-disabled': 0x21,
  'age': 0x2c,
  'deadline': 0x2d,
  'big-reports': 0x2f,
  'big-priority': 0x3a,
  'big-behavior': 0x3b,
  'big-communication': 0x32,
  'trash': 0x3c,
  'smile-happy': 0x3d,
  'smile-sad': 0x3e,
  'task-done': 0x2e,
  'summary': 0x3f,
  'calendar-empty': 0x40,
  'big-bigscreen': 0x5b,
  'watermark-settings': 0x50,
  'watermark-users': 0x5d,
  'notes': 0x5e,
  'report-list': 0x5f,
  'big-favorit': 0x7b,
  'download': 0x7c,
  'big-recent': 0x7d,
  'settings': 0x7e,
  //'recent': 0x5c,
  'arrow-report': 0xe000,
  'arrow-report-down': 0xe001,
  'page-up': 0xe002,
  'circle': 0xe003,
  'reverse': 0xe004,
  'play': 0xe005,
  'pause': 0xe006,
  'man': 0xe007,
  'arrow-up': 0x64,
  'big-tasks-active': 0xe008,
  'big-deadline': 0xe009,
  'big-time-crop': 0xe00a,
  'attachment': 0xe00b,
  'plus': 0xe00c,
  'ok': 0xe00d,
  'report': 0xe00e,
  'move': 0xe00f,
  'flag': 0xe010,
  'undo': 0xe011,
  'strike': 0xe012,
  'rich-text': 0xe013,
  'quote': 0xe014,
  'bold': 0xe015,
  'code': 0xe016,
  'italic': 0xe017,
  'list': 0xe018,
  'list-num': 0xe019,
  'redo': 0xe01a,
  'logout': 0xe01b,
  'error': 0xe01c,
  'big-trash': 0xe01e,
  'list-view': 0xe01d,
  'board-view': 0xe01f,
  'board-view-1': 0xe020,
  'board-view-2': 0xe021,
  'pulse': 0xe022,
  'open-folder': 0xe023,
  'infoboards': 0xe024,
  'infoboards3': 0xe024,
  'infoboards2': 0xe025,
  'eye-white': 0xe026,
  'open-new-window': 0xe027,
  'file-image': 0xe028,
  'file': 0xe029,
  'file-text': 0xe02a,
  'file-audio': 0xe02c,
  'file-archive-o': 0xe02d,
  'file-code-o': 0xe02e,
  'file-video-o': 0xe02f,
  'plug': 0x60,
  'pastdue': 0xe02b,
  'status-board-full-1': 0xe031,
  'recent': 0xe030,
  'file-csv': 0xe033,
  'group-closed2': 0xe034,
  'group-open2': 0xe035,
  'group-closed': 0xe036,
  'group-open': 0xe037,
  'integration': 0x5c,
  'time-reported': 0xe032,
  'time-estimated': 0xe038,
  'zzz': 0xe039,
  'big-custom-fields': 0xe03a,
  'triangle': 0xe03b,
  'triangle-down': 0xe03c,
  'field-numbers': 0xe03d,
  'field-checkbox': 0xe03e,
  'field-currency': 0xe03f,
  'field-text': 0xe040,
  'field-percentage': 0xe041,
  'settings-small': 0xe042,
  'pin-empty': 0xe043,
  'star': 0xe044,
  'star-empty': 0xe045,
  'statuses-big': 0xe046,
  'dnd': 0xe047,
  'filter': 0xe048,
  'collapce': 0xe049,
  'sort': 0xe04a,
  'project': 0xe04c,
  'tag': 0xe04d,
  'smart-folder': 0xe04e,
  'sprint': 0xe04f,
  'portfolio': 0xe050,
  'big-convert': 0xe051,
  'subtasks': 0xe052,
  'level-up': 0xe053,
  'upherited': 0xe054,
  'inherited': 0xe055,
  'inbox': 0xe04b,
  'info': 0xe056,
  'help': 0xe057,
  'csv-export': 0x4e,
  'csv-import': 0xe058,
  'more-1': 0xe059,
  'live-chat': 0xe05a,
  'setting-menu': 0xe05c,
  'upload': 0xe05b,
  'refresh': 0xe05d,
  'gdrive': 0xe05e,
  'connected': 0xe05f,
  'lock': 0xe060,
  'more-circle': 0xe061,
  'send-plane': 0xe05c
};
