import { FC, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { createOrder, clearOrder } from '../../services/slices/orderSlice';
import {
  clearConstructor,
  addIngredient
} from '../../services/slices/constructorSlice';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector((state) => state.burgerConstructor);
  const { orderRequest, orderModalData } = useSelector((state) => state.order);
  const { isAuthenticated } = useSelector((state) => state.user);
  const { ingredients } = useSelector((state) => state.ingredients);

  // Загружаем ингредиенты при инициализации
  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const ingredientType = e.dataTransfer.getData('text/plain');
    console.log('Dropped ingredient type:', ingredientType);

    const ingredientToAdd = ingredients.find(
      (ing) => ing.type === ingredientType
    );

    if (ingredientToAdd) {
      dispatch(addIngredient(ingredientToAdd));
    }
  };

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds)).then((result) => {
      if (createOrder.fulfilled.match(result)) {
        dispatch(clearConstructor());
      }
    });
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      onDrop={handleDrop}
    />
  );
};
