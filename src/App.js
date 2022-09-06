import React, { useState, useEffect } from "react";

const baseURL = "https://baconipsum.com/api/?start-with-lorem=1&type=all-meat?";

function App() {
  const [params, setParams] = useState({ count: "5", option: "" });
  const [texts, setTexts] = useState([]);

  const [clicked, setClicked] = useState(false);
  const [render, setRender] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (params.option) {
      setRender(!render);
      setIsVisible(true);
      setClicked(!clicked);
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setParams({ ...params, [name]: value });
    clicked || setClicked(true);
  };

  const generateURL = () => {
    return params.option === "paragraph"
      ? `${baseURL}paras=${params.count}`
      : `${baseURL}sentences=${params.count}`;
  };

  const url = generateURL();

  const fetchTexts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      setTexts(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(true);
      alert(`Whoops! Something went wrong 😐 Try reloading the page.`);
    }
  };
  useEffect(() => {
    fetchTexts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [render]);

  if (isLoading) {
    return (
      <section className="section-center">
        <div className="loading">
          <h1>loading...</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="section-center">
      <h3>Dummy text generator</h3>
      <div className="underline"></div>
      <form className="lorem-form" onSubmit={handleSubmit}>
        <section className="form-inputs">
          <label>
            Count:
            <input
              type="number"
              name="count"
              value={params.count}
              min="1"
              id="count"
              autoFocus={true}
              onChange={handleChange}
            />
          </label>
          <div className="options">
            <label>
              <input
                type="radio"
                name="option"
                value="paragraph"
                onChange={handleChange}
              />
              paragraph
            </label>
            <label>
              <input
                type="radio"
                name="option"
                value="sentence"
                onChange={handleChange}
              />
              sentence
            </label>
          </div>
        </section>
        <button type="submit" className="btn" disabled={clicked ? false : true}>
          Generate
        </button>
      </form>

      {isVisible && (
        <>
          <article className="lorem-text">
            {texts.map((text, i) => {
              return <p key={i}>{text.replaceAll(".", "◼")}</p>;
            })}
          </article>
          <p className="attention">Note: After every ◼, marks a sentence</p>
        </>
      )}
    </section>
  );
}

export default App;
