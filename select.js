const select = (element) => {
  const selected = document.querySelector(element);
  if (selected) {
    return selected;
  } else {
    throw new Error(`"${element}",does not exist`);
  }
};

export { select };
