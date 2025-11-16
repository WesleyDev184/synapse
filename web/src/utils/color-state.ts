import { NotificationCategoryEnum } from '@/http/notification/dto/notification.dto'

export const CATEGORY_COLORS: Record<NotificationCategoryEnum, string> = {
  [NotificationCategoryEnum.ASSIGNMENT]:
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [NotificationCategoryEnum.CHANGE_STATUS]:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [NotificationCategoryEnum.NEW_COMMENT]:
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [NotificationCategoryEnum.GENERAL_UPDATE]:
    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
}
