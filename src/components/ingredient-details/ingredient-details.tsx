import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector, useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const { ingredients, loading } = useSelector((state) => state.ingredients);

  // Мемоизируем поиск ингредиента по id
  const ingredientData = useMemo(
    () => ingredients.find((ingredient) => ingredient._id === id),
    [ingredients, id]
  );

  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  if (loading || (!ingredientData && ingredients.length === 0)) {
    return <Preloader />;
  }

  if (!ingredientData && ingredients.length > 0) {
    return <div>Ингредиент не найден</div>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData!} />;
};
