import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faFileCircleCheck,
  faFileArrowUp,
  faFileImage,
} from "@fortawesome/free-solid-svg-icons";
import "./css/addprofile.css";
import { useTranslation } from "react-i18next";

export default function Addprofile(prop) {
  const [inputValue, setinputValue] = useState({
    title: "",
    skills: [],
    workhistory: [],
    description: "",
    cv: "",
    educations: [],
    certifications: [],
    portfolio: [],
  });
  console.log(inputValue.portfolio);
  const { t } = useTranslation();

  const inputref = useRef(null);
  const inputrefedu = useRef(null);
  const inputrefcre = useRef(null);
  const inputrefpor = useRef(null);
  const inputrefporfile = useRef(null);
  const [newSkill, setNewSkill] = useState("");
  const [newWork, setNewWork] = useState("");

  const handleImage = () => {
    inputrefpor.current.click();
  };

  const handlePro = () => {
    inputrefporfile.current.click();
  };

  const handleNewSkillChange = (e) => {
    setNewSkill(e.target.value);
  };
  const handleNewWorkChange = (e) => {
    setNewWork(e.target.value);
  };

  const addSkill = () => {
    if (newSkill.trim() !== "") {
      setinputValue({
        ...inputValue,
        skills: [...inputValue.skills, newSkill.trim()],
      });
      setNewSkill(""); // Clear the input field after adding the skill
      console.log(inputValue.skills);
    }

    if (newWork.trim() !== "") {
      setinputValue({
        ...inputValue,
        workhistory: [...inputValue.workhistory, newWork.trim()],
      });
      setNewWork(""); // Clear the input field after adding the skill
      console.log(inputValue.workhistory);
    }
  };

  const [showpages, setshowpages] = useState("");

  let defalutSkill = [
    "Communication",
    "Computer ",
    "Leadership ",
    "Management ",
    "Problem-solving ",
    "programming ",
    "WordPress",
    "Teamwork",
  ];
  prop.prop.freelancerprofile.skills.forEach((skill) => {
    if (defalutSkill.includes(skill)) {
      defalutSkill = defalutSkill.filter((item) => item !== skill);
    }
  });
  const [skillsdelete, setskillsdelete] = useState([]);
  const [nskillsdelete, setnskillsdelete] = useState("");
  const [workdelete, setworkdelete] = useState([]);

  const handlecv = () => {
    inputref.current.click();
  };

  const handleEdu = () => {
    inputrefedu.current.click();
  };
  const handlecre = () => {
    inputrefcre.current.click();
  };

  const uploadcv = async (e) => {
    setinputValue({ ...inputValue, cv: e.target.files[0] });
  };

  const deletework = (work) => {
    inputValue.workhistory = inputValue.workhistory.filter(
      (item) => item !== work
    );
    console.log(inputValue.workhistory);
  };

  const deletedefalutskill = (skill) => {
    inputValue.skills = inputValue.skills.filter((item) => item !== skill);
    setnskillsdelete("delete");
    console.log(inputValue.skills);
  };

  const shownextpage = () => {
    setshowpages("active");
  };

  const showforthpage = () => {
    setshowpages("forth");
  };

  const showthirdpage = () => {
    setshowpages("second");
  };
  const showprethirdpage = () => {
    setshowpages("second");
  };
  const showprepage = () => {
    setshowpages("");
  };

  const uploadedu = async (e) => {
    setinputValue({
      ...inputValue,
      educations: [...inputValue.educations, e.target.files[0]],
    });
    console.log(inputValue.educations);
  };

  const uploadcet = async (e) => {
    setinputValue({
      ...inputValue,
      certifications: [...inputValue.certifications, e.target.files[0]],
    });
  };

  const remove = () => {
    prop.prop2();
  };

  function isFormDataEmpty(formData) {
    for (let pair of formData.entries()) {
      return false;
    }
    return true;
  }
  const isempty = (arr) => {
    if (arr.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const onsubmit = () => {
    editData();
    if (!isempty(skillsdelete) && !isempty(workdelete)) {
      if (skillsdelete && workdelete) {
        deleteSkill(skillsdelete, workdelete);
      } else {
        if (skillsdelete) {
          deleteSkill(skillsdelete, []);
          console.log(skillsdelete);
        }
        if (workdelete) {
          deleteSkill([], workdelete);
          console.log(workdelete);
        }
      }
    }
  };

  const editData = async () => {
    const formData = new FormData();
    if (inputValue.title) {
      formData.append("title", inputValue.title);
    }

    if (inputValue.description) {
      formData.append("description", inputValue.description);
    }

    if (inputValue.skills && inputValue.skills.length > 0) {
      inputValue.skills.forEach((skill, index) => {
        formData.append(`skills[${index}]`, skill);
      });
    }
    if (inputValue.workhistory && inputValue.workhistory.length > 0) {
      inputValue.workhistory.forEach((work, index) => {
        formData.append(`workhistory[${index}]`, work);
      });
    }
    if (inputValue.cv) {
      formData.append("cv", inputValue.cv);
      console.log(inputValue.cv);
    }

    if (inputValue.educations && inputValue.educations.length > 0) {
      inputValue.educations.forEach((edu, index) => {
        formData.append(`educationDocs`, edu);
      });
    }

    if (inputValue.certifications && inputValue.certifications.length > 0) {
      inputValue.certifications.forEach((cer, index) => {
        formData.append(`certificationDocs`, cer);
      });
    }

    console.log(inputValue);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    if (!isFormDataEmpty(formData)) {
      try {
        await axios.put(
          `http://localhost:4000/freelancer/edit/${prop.prop._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } catch (error) {
        console.error("errorr", error);
      }
    }
  };

  const deleteSkill = async (skillToDelete, workdelete) => {
    if (skillToDelete || workdelete) {
      try {
        const response = await axios.delete(
          `http://localhost:4000/freelancer/datadelete/${prop.prop._id}`,
          {
            data: { skillToDelete, workdelete },
          }
        );

        console.log("Updated freelancer profile:", response.data);
      } catch (error) {
        console.error("Error deleting skill:", error);
      }
    }
  };

  const openDocument = (value) => {
    const file = `http://localhost:4000/${value}`;
    window.open(file, "_blank");
  };

  const uploadpor = (e) => {
    const file = e.target.files[0];
    if (file) {
      setinputValue({
        ...inputValue,
        portfolio: [
          ...inputValue.portfolio,
          { type: "file", value: file, title: "" },
        ],
      });
    }
  };

  const uploadproimg = (e) => {
    const file = e.target.files[0];
    if (file) {
      setinputValue({
        ...inputValue,
        portfolio: [
          ...inputValue.portfolio,
          { type: "image", value: file, title: "" },
        ],
      });
    }
  };

  const handlePortfolioChange = (index, field, value) => {
    const newPortfolio = [...inputValue.portfolio];
    newPortfolio[index][field] = value;
    setinputValue({ ...inputValue, portfolio: newPortfolio });
  };

  const removePortfolioItem = (index) => {
    const newPortfolio = inputValue.portfolio.filter((_, i) => i !== index);
    setinputValue({ ...inputValue, portfolio: newPortfolio });
  };

  return (
    <>
      <div className="addpform">
        <div className="addp-content">
          <div className={`firstpage${showpages}`}>
            <div>
              {t("title")}
              <input
                className="input"
                type="text"
                placeholder={
                  prop.prop.freelancerprofile.title
                    ? prop.prop.freelancerprofile.title
                    : "insert your Title"
                }
                value={inputValue.title}
                onChange={(e) => {
                  setinputValue({ ...inputValue, title: e.target.value });
                }}
              />
            </div>
            <div className="parent-skill">
              {t("Your Skills")}
              <div style={{ borderBottom: "solid", margin: "1rem" }}>
                {prop.prop.freelancerprofile.skills.map((skill) => (
                  <>
                    {!skillsdelete.includes(skill) && (
                      <>
                        <div className="skills">
                          <FontAwesomeIcon
                            className="delete"
                            onClick={() => {
                              setskillsdelete([...skillsdelete, skill]);
                            }}
                            icon={faTrash}
                          />
                          {skill}
                        </div>
                      </>
                    )}
                  </>
                ))}

                {inputValue.skills.map((nskill) => (
                  <>
                    {nskillsdelete != "delete" &&
                      !skillsdelete.includes(nskill) && (
                        <div className="skills">
                          <FontAwesomeIcon
                            className="delete"
                            onClick={() => {
                              deletedefalutskill(nskill);
                            }}
                            icon={faTrash}
                          />
                          <>{nskill} </>
                        </div>
                      )}{" "}
                  </>
                ))}
              </div>
              <input
                className="input"
                type="text"
                placeholder="Add new skills"
                value={newSkill}
                onChange={handleNewSkillChange}
              />
              <FontAwesomeIcon
                className="add"
                icon={faPlus}
                onClick={addSkill}
              />
              <br />
              <div style={{ display: "flex" }}></div>
              {defalutSkill.map((dskills) => (
                <>
                  {!inputValue.skills.includes(dskills) && (
                    <div className="skills">
                      <FontAwesomeIcon
                        className="delete"
                        icon={faPlus}
                        onClick={() => {
                          setinputValue({
                            ...inputValue,
                            skills: [...inputValue.skills, dskills],
                          });
                        }}
                      />
                      {dskills}
                    </div>
                  )}
                </>
              ))}{" "}
              <br />
              <button className="popup-btn shift-btn" onClick={shownextpage}>
                {t("Next")}
              </button>
            </div>
          </div>
          <div className={`secondpage${showpages}`}>
            <div>
              <div className="overview">
                {t("overview")}
                <textarea
                  className="input"
                  type="text"
                  placeholder={
                    prop.prop.freelancerprofile.description
                      ? prop.prop.freelancerprofile.description
                      : "insert your overview"
                  }
                  value={inputValue.description}
                  onChange={(e) => {
                    setinputValue({
                      ...inputValue,
                      description: e.target.value,
                    });
                  }}
                />{" "}
                <br />
              </div>
              <div className="workparent">
                <div className="workchild1">
                  {t("Work Experience")}
                  <br />

                  {prop.prop.freelancerprofile.workhistory.map((workhistory) =>
                    !workdelete.includes(workhistory) ? (
                      <>
                        <textarea
                          style={{
                            backgroundColor: "rgba(73, 154, 149, 0.682)",
                          }}
                          className="textarea"
                          type="text"
                          readOnly
                          value={workhistory}
                        />
                        <FontAwesomeIcon
                          className="workadd"
                          icon={faTrash}
                          onClick={() => {
                            setworkdelete([...workdelete, workhistory]);
                          }}
                        />{" "}
                        <br />
                      </>
                    ) : null
                  )}
                  {inputValue.workhistory.map((workhistory) => (
                    <>
                      <textarea
                        style={{ backgroundColor: "rgba(73, 154, 149, 0.682)" }}
                        className="textarea"
                        type="text"
                        readOnly
                        value={workhistory}
                      />
                      <FontAwesomeIcon
                        className="workadd"
                        icon={faTrash}
                        onClick={() => {
                          deletework(workhistory);
                        }}
                      />{" "}
                      <br />
                    </>
                  ))}
                </div>
                <div className="workchild2">
                  {t("Add Work Experience")}
                  <br />
                  <div>
                    <textarea
                      className="textarea"
                      type="text"
                      placeholder={"insert your work Experience"}
                      value={newWork}
                      onChange={handleNewWorkChange}
                    />
                    <FontAwesomeIcon
                      className="workadd"
                      icon={faPlus}
                      onClick={addSkill}
                    />{" "}
                    <br />
                  </div>
                </div>
              </div>
              <br />
              <button
                className="popup-btn shift-btn firstbtn"
                onClick={showprepage}
              >
                {t("Back")}
              </button>
              <button
                className="popup-btn shift-btn secondbtn"
                onClick={showthirdpage}
              >
                {t("Next")}
              </button>
            </div>
          </div>

          <div className={`thirdpage${showpages}`}>
            <div className="cvparent">
              {t("Your CV")}
              {prop.prop.freelancerprofile.cv ? (
                <div className="cv1">
                  <img
                    src={`/image/cv.png`}
                    onClick={() => {
                      openDocument(prop.prop.freelancerprofile.cv);
                    }}
                  />
                </div>
              ) : null}
              {t("Change CV")}
              <div className="cv2" onClick={handlecv}>
                +
                <img src={`/image/cvup.png`} />
                <input
                  type="file"
                  onChange={uploadcv}
                  ref={inputref}
                  style={{ display: "none" }}
                />
              </div>
            </div>{" "}
            <br /> <br />
            {t("additional document")}
            <br />
            <br />
            <div className="fileparent">
              <div className="eduparent">
                <div className="">
                  <div className="dropdowns">
                    <label>
                      <span>{t("Educations")}</span>
                    </label>
                    <div
                      className="plusedu"
                      onClick={handleEdu}
                      title="Add document"
                    >
                      <FontAwesomeIcon icon={faFileArrowUp} size="2x" />
                      <input
                        type="file"
                        onChange={uploadedu}
                        ref={inputrefedu}
                        style={{ display: "none" }}
                      />
                    </div>
                    <ul className="slide">
                      {prop.prop.freelancerprofile.additionaldoc.educations &&
                      prop.prop.freelancerprofile.additionaldoc.educations
                        .length > 0 ? (
                        prop.prop.freelancerprofile.additionaldoc.educations.map(
                          (education, index) => (
                            <li key={index}>
                              <FontAwesomeIcon
                                icon={faFileCircleCheck}
                                size="2x"
                                color="rgba(73, 154, 149, 0.61)"
                                onClick={() => openDocument(education)}
                                style={{ marginRight: "10px" }}
                              />
                            </li>
                          )
                        )
                      ) : (
                        <li>
                          <a href="#">No document</a>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="edu2"></div>

              <div className="eduparent">
                <div className="">
                  <div className="dropdownss">
                    <label>
                      <span>{t("Certifications")}</span>
                    </label>
                    <div
                      className="plusedu"
                      onClick={handlecre}
                      title="Add document"
                    >
                      <FontAwesomeIcon icon={faFileArrowUp} size="2x" />
                      <input
                        type="file"
                        onChange={uploadcet}
                        ref={inputrefcre}
                        style={{ display: "none" }}
                      />
                    </div>
                    <ul className="sliders">
                      {prop.prop.freelancerprofile.additionaldoc.certifications.map(
                        (certifications, index) => (
                          <li key={index}>
                            <FontAwesomeIcon
                              icon={faFileCircleCheck}
                              size="2x"
                              color="rgba(73, 154, 149, 0.61)"
                              onClick={() => openDocument(certifications)}
                              style={{ marginRight: "10px" }}
                            />
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <br /> <br />
            </div>
            <button
              className="popup-btn shift-btn firstbtn"
              onClick={shownextpage}
            >
              {t("Back")}
            </button>
            <button
              className="popup-btn shift-btn secondbtn"
              onClick={showforthpage}
            >
              {t("Next")}
            </button>
          </div>

          <div className={`forthpage${showpages}`}>
            Portfolio
            <div className="fileparents">
              <div className="dropdowns">
                <label>
                  <span>{t("Your Files")}</span>
                </label>
                <div
                  className="plusedu"
                  onClick={handlePro}
                  title="Add document"
                >
                  <FontAwesomeIcon icon={faFileArrowUp} size="2x" />
                  <input
                    type="file"
                    onChange={uploadpor}
                    ref={inputrefporfile}
                    style={{ display: "none" }}
                  />
                </div>
                <ul className="slide">
                  {inputValue.portfolio
                    .filter((item) => item.type === "file")
                    .map((item, index) => (
                      <li key={index}>
                        <FontAwesomeIcon
                          icon={faFileCircleCheck}
                          size="2x"
                          color="rgba(73, 154, 149, 0.61)"
                          onClick={() => openDocument(item.value)}
                          style={{ marginRight: "10px" }}
                        />
                        <input
                          type="text"
                          placeholder="Add Title"
                          value={item.title}
                          onChange={(e) =>
                            handlePortfolioChange(
                              index,
                              "title",
                              e.target.value
                            )
                          }
                        />
                        <button onClick={() => removePortfolioItem(index)}>
                          Remove
                        </button>
                      </li>
                    ))}
                </ul>
              </div>

              <div className="dropdowns">
                <label>
                  <span>{t("Your Image")}</span>
                </label>
                <div
                  className="plusedu"
                  onClick={handleEdu}
                  title="Add document"
                >
                  <FontAwesomeIcon icon={faFileImage} size="2x" />
                  <input
                    type="file"
                    onChange={uploadproimg}
                    ref={inputrefedu}
                    style={{ display: "none" }}
                  />
                </div>
                <ul className="slide">
                  {inputValue.portfolio
                    .filter((item) => item.type === "image")
                    .map((item, index) => (
                      <li key={index}>
                        <FontAwesomeIcon
                          icon={faFileCircleCheck}
                          size="1x"
                          color="rgba(73, 154, 149, 0.61)"
                          onClick={() => openDocument(item.value)}
                          style={{ marginRight: "10px" }}
                        />
                        <input
                          type="text"
                          placeholder="Add Title"
                          value={item.title}
                          onChange={(e) =>
                            handlePortfolioChange(
                              index,
                              "title",
                              e.target.value
                            )
                          }
                        />

                        <button onClick={() => removePortfolioItem(index)}>
                          Remove
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <input
              type="url"
              name="text"
              className="inputurl"
              placeholder="Add Links"
              onChange={(e) =>
                setinputValue({
                  ...inputValue,
                  portfolio: [
                    ...inputValue.portfolio,
                    { type: "url", value: e.target.value, title: "" },
                  ],
                })
              }
            />
            <div className="inputbox">
              <input required="required" type="text" />
              <span>Add Title</span>
              <i></i>
            </div>
            <button
              className="popup-btn shift-btn firstbtn"
              onClick={showprethirdpage}
            >
              {t("Back")}
            </button>
            <button
              className="popup-btn shift-btn secondbtn"
              onClick={() => {
                onsubmit();
              }}
            >
              {t("Submit")}
            </button>
            <button
              className="popup-btn shift-btn thirdbtn"
              id="x"
              onClick={remove}
            >
              X
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
