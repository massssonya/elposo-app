import { MenuItem, Modifier, ModifierGroup } from '@shared/types/menu'
  
export const MOCK_CATEGORIES = [
  { id: 'cat_1', name: 'Горячее' },
  { id: 'cat_2', name: 'Напитки' },
  { id: 'cat_3', name: 'Десерты' },
  { id: 'cat_4', name: 'Закуски' },
];
  
export const MOCK_ITEMS: MenuItem[] = [
  { id: 'm1', name: 'Бургер Фирменный', price: 450, categoryId: 'cat_1', isAvailable: true, modifierGroupIds: ['g_burger_top', 'g_burger_remove', 'g_sauces'], imageUrl: 'https://vkuson.com/assets/cache_image/assets/menu/burgers/%D0%93%D0%B0%D0%BC_1500x1066_446.webp' },
  { id: 'm2', name: 'Стейк Рибай', price: 1200, categoryId: 'cat_1', isAvailable: true, modifierGroupIds: ['g_cooking', 'g_steak_sauces'], imageUrl: 'https://menunedeli.ru/wp-content/uploads/2023/06/2A3866F5-E242-4B97-B336-8BD6AAFDB1AB-933x700.jpeg' },
  { id: 'm3', name: 'Капучино 300мл', price: 220, categoryId: 'cat_2', isAvailable: true, modifierGroupIds: ['g_coffee_milk', 'g_coffee_syrup'], imageUrl: 'https://latte.ru/wa-data/public/site/img/capp.jpeg' },
  { id: 'm4', name: 'Кола Классик', price: 150, categoryId: 'cat_2', isAvailable: true, imageUrl: 'https://dostavka-produktov.ru/image/cache/catalog/products_images/3361649-1000x1000.jpg' },
  { id: 'm5', name: 'Чизкейк Нью-Йорк', price: 350, categoryId: 'cat_3', isAvailable: false },
  { id: 'm6', name: 'Картофель Фри', price: 180, categoryId: 'cat_4', isAvailable: true, modifierGroupIds: ['g_sauces'], imageUrl: 'https://pizzaexpress44.ru/media/cache/product_popup/images/product/fri-100.jpg' }, 
];
  
export const MODIFIERS: Modifier[] = [
  { id: 'rare', name: 'Rare (С кровью)', price: 0, type: 'add' },
  { id: 'medium', name: 'Medium (Средняя)', price: 0, type: 'add' },
  { id: 'well_done', name: 'Well Done (Полная)', price: 0, type: 'add' },
  
  // Добавки в бургер (увеличивают цену)
  { id: 'mod_cheese', name: 'Сыр Чеддер', price: 50, type: 'add' },
  { id: 'mod_bacon', name: 'Бекон', price: 70, type: 'add' },
  { id: 'mod_jalapeno', name: 'Халапеньо (Острый)', price: 40, type: 'add' },
  
  // Исключения из бургера (цена 0, убирают ингредиент)
  { id: 'rem_onion', name: 'Убрать лук', price: 0, type: 'remove' },
  { id: 'rem_tomato', name: 'Убрать помидор', price: 0, type: 'remove' },
  { id: 'rem_pickles', name: 'Убрать огурцы', price: 0, type: 'remove' },
  
  // Соусы (универсальные)
  { id: 'sauce_ketchup', name: 'Кетчуп', price: 40, type: 'add' },
  { id: 'sauce_cheese', name: 'Сырный соус', price: 40, type: 'add' },
  { id: 'sauce_bbq', name: 'BBQ соус', price: 50, type: 'add' },
  
  // Молоко для кофе (опции выбора)
  { id: 'milk_regular', name: 'Обычное молоко', price: 0, type: 'add' },
  { id: 'milk_coconut', name: 'Кокосовое молоко', price: 80, type: 'add' },
  { id: 'milk_almond', name: 'Миндальное молоко', price: 80, type: 'add' },
  
  // Сиропы для кофе
  { id: 'syrup_caramel', name: 'Карамельный сиропы', price: 30, type: 'add' },
  { id: 'syrup_vanilla', name: 'Ванильный сироп', price: 30, type: 'add' },
];
  
export const MODIFIER_GROUPS: ModifierGroup[] = [
  // Обязательный выбор прожарки (строго 1)
  { id: 'g_cooking', name: 'Степень прожарки', min: 1, max: 1, modifierIds: ['rare', 'medium', 'well_done'] },
    
  // Опциональные топпинги для бургера (от 0 до 5 штук)
  { id: 'g_burger_top', name: 'Добавить в бургер', min: 0, max: 5, modifierIds: ['mod_cheese', 'mod_bacon', 'mod_jalapeno'] },
    
  // Группа для удаления ингредиентов (от 0 до 3 штук)
  { id: 'g_burger_remove', name: 'Исключить из состава', min: 0, max: 3, modifierIds: ['rem_onion', 'rem_tomato', 'rem_pickles'] },
    
  // Соусы для бургеров и фри
  { id: 'g_sauces', name: 'Соусы', min: 0, max: 4, modifierIds: ['sauce_ketchup', 'sauce_cheese', 'sauce_bbq'] },
    
  // Премиум соусы только для стейка
  { id: 'g_steak_sauces', name: 'Соус к стейку', min: 0,  modifierIds: ['sauce_bbq'] },

  // Обязательный выбор молока для капучино (строго 1)
  { id: 'g_coffee_milk', name: 'Выбор молока', min: 1, max: 1, modifierIds: ['milk_regular', 'milk_coconut', 'milk_almond'] },
    
  // Опциональные сиропы (до 2 штук)
  { id: 'g_coffee_syrup', name: 'Сиропы', min: 0, max: 2, modifierIds: ['syrup_caramel', 'syrup_vanilla'] },
];
  