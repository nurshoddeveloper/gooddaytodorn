
export function getGlyphByType(taskType) {
  return glyphs[taskType] || glyphs.task;
}

const glyphs = {

  // from gd.const.task.icon and src/skin/common/gd-tasks/gd-task-icons.scss

  task: 0x62, //'gdt-task',
  idea: 0x3e, //'gdt-idea',
  question: 0x61,//'gdt-question',
  bug: 0x43, //'gdt-bug',


  beer: 0x63, //'gdt-beer',
  book: 0x65, //'gdt-book',
  briefcase: 0x66, //'gdt-briefcase',
  social_broadcast: 0x67, //'gdt-social-broadcast',
  upload: 0x6a, //'gdt-cloud-upload',
  download: 0x6b, //'gdt-cloud-download',


  device_mobile: 0x6d, //"gdt-device-mobile",
  device_desktop: 0x6e, //"gdt-device-desktop",
  device_video: 0x6f, //"gdt-device-camera-video",
  device_camera: 0x70, //"gdt-device-camera",
  database: 0x71, //"gdt-database",
  file_binary: 0x72, //"gdt-file-binary",
  file_code: 0x73, //"gdt-file-code",
  file_contact: 0x74, //"gdt-file-contact",
  file_text: 0x75, //"gdt-file-text",
  flame: 0x76, //"gdt-flame",
  globe: 0x77, //"gdt-globe",
  gift: 0x78, //"gdt-gift",
  dev_gist: 0x79, //"gdt-dev-gist",
  graph: 0x7a, //"gdt-graph",
  law: 0x45, //"gdt-law",
  key: 0x47, //"gdt-key",
  link: 0x48, //"gdt-link",
  location: 0x49, //"gdt-location",
  mail: 0x4b, //"gdt-mail",
  mail_read: 0x4c, //"gdt-mail-read",
  mention: 0x4e, //"gdt-mention",
  milestone: 0x50, //"gdt-milestone",
  study: 0x51, //"gdt-study",
  pulse: 0x54, //"gdt-pulse",
  social_rss: 0x56, //"gdt-social-rss",
  search: 0x57, //"gdt-search",
  squirrel: 0x58, //"gdt-squirrel",
  steps: 0x59, //"gdt-steps",
  telescope: 0x31, //"gdt-telescope",
  tools: 0x32, //"gdt-tools",
  contact: 0x33, //"gdt-contact",
  anchor: 0x34, //"gdt-anchor",
  bookmark: 0x37, //"gdt-bookmark",
  burst: 0x38, //"gdt-burst",
  first_aid: 0x21, //"gdt-first-aid",
  paint_bucket: 0x22, //"gdt-paint-bucket",
  quote: 0x26, //"gdt-quote",
  social_youtube: 0x27, //"gdt-social-youtube",
  trophy: 0x28, //"gdt-trophy",
  shield: 0x2b, //"gdt-shield",
  shopping_cart: 0x2d, //"gdt-shopping-cart",
  phone: 0x2e, //"gdt-phone",
  rocket: 0x2f, //"gdt-rocket",
  brush: 0x3a, //"gdt-brush",
  bucket: 0x3b, //"gdt-bucket",
  social_twitter: 0x3f, //"gdt-social-twitter"

};