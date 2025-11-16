export enum NotificationCategoryEnum {
  ASSIGNMENT = 'ASSIGNMENT',
  CHANGE_STATUS = 'CHANGE_STATUS',
  NEW_COMMENT = 'NEW_COMMENT',
  GENERAL_UPDATE = 'GENERAL_UPDATE',
}

export interface NotificationDTO {
  id: string
  taskId: string
  title: string
  content: string
  category: NotificationCategoryEnum
  createdAt: string
}
