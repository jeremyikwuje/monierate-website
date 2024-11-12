let globalTimezone: string = 'UTC';

export const setTimezone = (timezone: string) => {
  globalTimezone = timezone;
};

export const getTimezone = () => globalTimezone;