import { useState, useRef, useEffect, FC, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector, useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const BurgerIngredients: FC = () => {
  const dispatch = useDispatch();
  const { ingredients, loading } = useSelector((state) => state.ingredients);

  // Мемоизируем фильтрацию ингредиентов по типам
  const buns = useMemo(
    () => ingredients.filter((ingredient) => ingredient.type === 'bun'),
    [ingredients]
  );

  const mains = useMemo(
    () => ingredients.filter((ingredient) => ingredient.type === 'main'),
    [ingredients]
  );

  const sauces = useMemo(
    () => ingredients.filter((ingredient) => ingredient.type === 'sauce'),
    [ingredients]
  );

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  useEffect(() => {
    if (ingredients.length === 0 && !loading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length, loading]);

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    const scrollToElement = (element: HTMLElement | null) => {
      if (element && contentRef.current) {
        const containerTop = contentRef.current.offsetTop;
        const elementTop = element.offsetTop;
        const scrollTop = elementTop - containerTop - 20; // 20px отступ сверху

        contentRef.current.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
      }
    };

    if (tab === 'bun') {
      scrollToElement(titleBunRef.current);
    } else if (tab === 'main') {
      scrollToElement(titleMainRef.current);
    } else if (tab === 'sauce') {
      scrollToElement(titleSaucesRef.current);
    }
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
      contentRef={contentRef}
    />
  );
};
