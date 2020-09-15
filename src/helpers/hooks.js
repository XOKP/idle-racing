import { useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  experienceSelector,
  tracksStatsSelector,
  raceSponsorsActiveSelector,
  tracksSelector,
  trackStatsSelector,
  eventMultipliersSelector,
} from '../state/selectors';
import {
  buffValue,
  discountValue,
  capitalize,
  expLevel,
  expNextLevel,
  moneySponsorsCount,
  eventSponsorsStats,
  passiveMoneySponsors,
} from './utils';
import { raceEvents } from './data';

export const useOpenClose = defaultValue => {
  const [open, setOpen] = useState(!!defaultValue);

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return [open, onOpen, onClose];
};

export const useCurrentPage = () => {
  const matchGarage = useRouteMatch('/garage');
  const matchDealerBrand = useRouteMatch('/dealer/:brand');
  const matchDealer = useRouteMatch('/dealer');
  const matchRaceEvent = useRouteMatch('/race/:event');
  const matchRace = useRouteMatch('/race');
  const matchSettings = useRouteMatch('/settings');

  let selectedPage;
  selectedPage = matchGarage ? 'Garage' : selectedPage;
  selectedPage = matchDealer ? 'Dealer' : selectedPage;
  selectedPage = matchDealerBrand
    ? '/' + capitalize(matchDealerBrand?.params?.brand)
    : selectedPage;
  selectedPage = matchRace ? 'Race' : selectedPage;
  selectedPage = matchRaceEvent
    ? '/' + capitalize(matchRaceEvent?.params?.event)
    : selectedPage;
  selectedPage = matchSettings ? 'Settings' : selectedPage;

  const backPage =
    (matchDealerBrand && '/dealer') || (matchRaceEvent && '/race') || '/';

  return { name: selectedPage, back: backPage };
};

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
};

export const useDynamicCardContainerWidth = (
  cardWidth = 160,
  cardMargin = 16
) => {
  const { width } = useWindowDimensions();

  return (
    Math.floor((width - 2 * 24) / (cardWidth + cardMargin)) *
    (cardWidth + cardMargin)
  );
};

export const useExperienceBusiness = () => {
  const experience = useSelector(experienceSelector);
  const { exp, max, newCars, usedCars } = experience.business;
  const level = expLevel(exp, max);
  const availablePoints = level - 1 - newCars - usedCars;

  return {
    ...experience.business,
    nextLevel: expNextLevel(exp),
    availablePoints,
  };
};
export const useExperienceRace = () => {
  const experience = useSelector(experienceSelector);
  const { exp, max, price, prizes } = experience.race;
  const level = expLevel(exp, max);
  const availablePoints = level - 1 - price - prizes;

  return {
    ...experience.race,
    nextLevel: expNextLevel(exp),
    availablePoints,
  };
};
export const useExperienceMechanic = () => {
  const experience = useSelector(experienceSelector);
  const { exp, max, acc, spd, hnd } = experience.mechanic;
  const level = expLevel(exp, max);
  const availablePoints = level - 1 - acc - spd - hnd;

  return {
    ...experience.mechanic,
    nextLevel: expNextLevel(exp),
    availablePoints,
  };
};

export const useCarPriceWithDiscount = price => {
  const experience = useExperienceBusiness();

  return discountValue(price, experience.newCars);
};

export const useCarPriceWithBuff = price => {
  const experience = useExperienceBusiness();

  return buffValue(price, experience.usedCars);
};

export const useRacePrizesWithBuff = prizes => {
  const experience = useExperienceRace();

  return prizes.map(prize =>
    isNaN(prize) ? prize : buffValue(prize, experience.prizes)
  );
};

export const useRacePriceWithDiscount = price => {
  const experience = useExperienceRace();

  return discountValue(price, experience.price);
};

export const useUpgradePriceWithDiscount = (price, type) => {
  const experience = useExperienceMechanic();

  return discountValue(price, experience[type]);
};

export const usePreviousUnlockedTrackChecker = tracks => {
  const tracksStats = useSelector(tracksStatsSelector);

  const isPreviousUnlocked = index => {
    return (
      raceEvents.find(({ type }) => type === tracks[index]?.category)
        ?.unlocked ||
      index === 0 ||
      tracksStats[tracks[index - 1]?.id]?.won > 0
    );
  };

  return isPreviousUnlocked;
};

export const usePassiveIncomeEvent = event => {
  const sponsors = useSelector(raceSponsorsActiveSelector);
  const eventMultipliers = useSelector(eventMultipliersSelector);

  const multiplier = ~~eventMultipliers?.[event] || 1;

  return multiplier * moneySponsorsCount(sponsors, event);
};

export const usePassiveIncome = () => {
  const sponsors = useSelector(raceSponsorsActiveSelector);
  const eventMultipliers = useSelector(eventMultipliersSelector);

  return passiveMoneySponsors(sponsors, eventMultipliers);
};

export const useMechanicsCount = () => {
  const sponsors = useSelector(raceSponsorsActiveSelector);

  return Object.values(sponsors).filter(
    sponsor => sponsor.reward === 'mechanic'
  ).length;
};

export const useEventTracksStatsState = eventType => {
  const tracks = useSelector(tracksSelector);
  const tracksStats = useSelector(tracksStatsSelector);
  const eventRacesAll = tracks.filter(item => item.category === eventType);

  return eventSponsorsStats(eventRacesAll, tracksStats);
};

export const useTrackStatsState = trackId => {
  const trackStats = useSelector(trackStatsSelector(trackId));

  return {
    raced: trackStats?.raced,
    won: trackStats?.won > 0,
    won10: trackStats?.won >= 10,
  };
};
