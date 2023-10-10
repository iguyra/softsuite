import Search from "../../Components/Search";
import { TableList } from "../../Components/Layouts/TableList";

import { useMemo } from "react";

import React, { useEffect, useState, useCallback } from "react";

import makeApiCall from "../../utils/makeApiCall";

import { Label } from "reactstrap";
import RadioField from "../../Components/Layouts/Fields/RadioField";
import ToggleField from "../../Components/Layouts/Fields/ToggleField";
import TextField from "../../Components/Layouts/Fields/TextField";
import SelectField from "../../Components/Layouts/Fields/SelectField";
import { useForm, Controller } from "react-hook-form";

function Elements() {
  const [showModal, setShowModal] = useState(false);

  const [isUpdate, setIsUpdate] = useState(false);
  const [element, setElement] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [IsError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [currentTabPlane, setCurrentTabPlane] = useState(1);
  const [elementsList, setElementList] = useState(1);
  const [api, setAPI] = useState();

  const [elClassificationOptions, setElClassificationOptions] = useState([]);
  const [elementCategoryOptions, setElementCategoryOptions] = useState([]);
  const [isSelectedMonthsFieldDisabled, setIsSelectedMonthsFieldDisabled] =
    useState(true);
  const [payRunOptions, setPayRunOptions] = useState([]);

  const { register, handleSubmit, formState, setValue, watch } = useForm({
    defaultValues: {
      name: element?.name,
      description: element?.description,
      payRunId: element?.payRunId,
      payRunValueId: element?.payRunValueId,
      classificationId: element?.classificationId,
      classificationValueId: element?.classificationValueId,
      categoryId: element?.categoryId,
      categoryValueId: element?.categoryValueId,
      reportingName: element?.reportingName,
      processingType: element?.processingType,
      status: "active",
      prorate: element?.prorate,
      effectiveStartDate: element?.effectiveStartDate,
      effectiveEndDate: element?.effectiveEndDate,
      selectedMonths: [],
      payFrequency: element?.payFrequency,
      modifiedBy: "Preston A.",
    },
  });

  const watchedClassificationValueId = watch("classificationValueId");
  const watchedPayFrequency = watch("payFrequency");
  const watchedPayRunValueId = watch("payRunValueId");
  const watchedCategoryValueId = watch("categoryValueId");
  const watchedStatus = watch("status");

  const resetFlag = () => {
    setIsSubmitted(false);
    setIsError(false);
    setIsDeleted(false);
    setErrorMsg("");
    setIsAdded(false);
    setIsUpdated(false);
    setIsUpdate(false);
    setShowModal(false);
    setElement({});

    setCurrentTabPlane(1);
  };

  useEffect(() => {
    if (isDeleted || isAdded || isUpdated || IsError) {
      setTimeout(() => {
        resetFlag();
      }, 3000);
    }
  }, [isDeleted, isAdded, isUpdated, IsError]);

  useEffect(() => {
    const api = new makeApiCall();
    setAPI(api);
  }, []);

  useEffect(() => {
    if (watchedStatus === false) {
      setValue("status", "inactive");
    } else {
      setValue("status", "active");
    }

    if (watchedCategoryValueId) {
      let category = elementCategoryOptions.find(
        (item) => +item.value === +watchedCategoryValueId
      );

      if (!category) return;

      console.log(category, "caestofryyyy--");

      setValue("categoryId", +category.lookupId);
    }
  }, [watchedCategoryValueId]);

  useEffect(() => {
    if (!api) return;

    const fetchElements = async () => {
      setIsLoading(true);

      try {
        let data = await api.get(`elements`);
        let elements = data.data.content.filter(
          (item) => item.modifiedBy === "Preston A."
        );

        // const categoryValuePromises = elements.map((item) =>
        //   api.get(
        //     `lookups/${item.categoryId}/lookupvalues/${item.categoryValueId}`
        //   )
        // );
        // const classificationValuePromises = elements.map((item) =>
        //   api.get(
        //     `lookups/${item.classificationId}/lookupvalues/${item.classificationValueId}`
        //   )
        // );

        // // Wait for all categoryValueId and classificationValueId API calls to complete
        // const [categoryValues, classificationValues] = await Promise.all([
        //   Promise.all(categoryValuePromises),
        //   Promise.all(classificationValuePromises),
        // ]);

        // console.log(categoryValues, classificationValues, "SLSLSLLSL");

        // // Process responses and update elements
        // elements = elements.map((item, index) => {
        //   item.categoryValueId = categoryValues[index].name;
        //   item.classificationValueId = classificationValues[index].name;
        //   return item;
        // });

        setElementList(elements);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchElements();
  }, [isDeleted, isAdded, api]);

  useEffect(() => {
    if (watchedPayFrequency === "Selected Months") {
      setIsSelectedMonthsFieldDisabled(false);
    }
  }, [watchedPayFrequency, watchedStatus]);

  useEffect(() => {
    if (!api) return;

    let fetchlookupvalues = async () => {
      let data = await api.get(
        `lookups/5/lookupvalues/${+watchedPayRunValueId}`
      );
      console.log(data, "FIRST_LOOKUP");

      setValue("payRunId", +data.lookupId);
    };

    if (watchedPayRunValueId) {
      fetchlookupvalues();
    }
  }, [watchedPayRunValueId, api]);

  useEffect(() => {
    if (!api || !watchedClassificationValueId) return;

    let fetchlookupvalues = async () => {
      let data = await api.get(
        `lookups/2/lookupvalues/${+watchedClassificationValueId}`
      );

      let data_2 = await api.get(`lookups/1/lookupvalues`);

      setValue("classificationId", +data.lookupId);

      let lookupName = data.name;

      let categoryOptions = [];
      if (data.name === "Non-Grossable Earning") {
        categoryOptions = data_2.filter(
          (item) => !item.name.includes("Deduction")
        );
      } else {
        categoryOptions = data_2.filter((item) =>
          item.name.includes(lookupName)
        );
      }

      categoryOptions = categoryOptions.map((item) => {
        return { name: item.name, value: +item.id, ...item };
      });

      setElementCategoryOptions(categoryOptions);
    };

    if (watchedClassificationValueId) {
      console.log(
        watchedClassificationValueId,
        "watchedClassificationValueId>>"
      );
      fetchlookupvalues();
    }
  }, [watchedClassificationValueId, api]);

  useEffect(() => {
    if (!api) return;

    const fetchlookupvalues = async () => {
      setIsLoading(true);

      try {
        let data = await api.get(`lookups/2/lookupvalues`);

        let el_classification = data.map((item) => {
          return { name: item.name, value: +item.id };
        });

        setElClassificationOptions(el_classification);

        setIsLoading(false);
      } catch (err) {
        handleError();
        setIsLoading(false);
      }
    };

    const fetchPayRunLookUps = async () => {
      setIsLoading(true);

      try {
        let data = await api.get(`lookups/5/lookupvalues`);

        let payRunOptions = data.map((item) => {
          return { name: item.name, value: +item.id };
        });

        setPayRunOptions(payRunOptions);

        setIsLoading(false);
      } catch (err) {
        handleError();
        setIsLoading(false);
      }
    };
    fetchlookupvalues();
    fetchPayRunLookUps();
  }, [isSubmitted, api]);

  const toggle = useCallback(() => {
    setShowModal(!showModal);
    resetFlag();
  }, [showModal]);

  const handleEdit = (element) => {
    setIsUpdate(true);
    setElement(element);
    Object.keys(element).forEach((key) => {
      setValue(key, element[key]);
    });
    setShowModal(!showModal);
  };

  const onClickDelete = async (p) => {
    setElement(p);
    setIsLoading(true);
    try {
      await api.delete(`elements/${p.id}`);
      setIsDeleted(true);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  function handleError(err) {
    let { message } = err?.response?.data || {};

    setIsLoading(false);
    setIsSubmitted(false);
    setIsError(true);

    setErrorMsg(message || "a server error occured");
  }

  const handleNextTabPlane = (id) => {
    setCurrentTabPlane(id);
  };

  const handleSave = async (values) => {
    values.categoryId = +values.categoryId;
    values.categoryValueId = +values.categoryValueId;
    values.classificationId = +values.classificationId;
    values.payRunValueId = +values.payRunValueId;
    values.classificationValueId = +values.classificationValueId;
    setIsLoading(true);
    if (!isUpdate) {
      try {
        let data = await api.post(`elements`, values);

        setIsAdded(true);
        handleNextTabPlane(currentTabPlane + 1);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        let data = await api.put(`elements/${element.id}`, values);

        setIsAdded(true);
        setIsLoading(false);

        handleNextTabPlane(currentTabPlane + 1);
      } catch (err) {
        setIsLoading(false);
      }
    }
  };

  // Column
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        filterable: false,
      },

      {
        Header: "Element Classification",
        accessor: "classificationValueId",
        filterable: false,
      },

      {
        Header: "Element Category",
        accessor: "categoryValueId",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Date & Time Modified",

        Cell: (cellProps) => {
          let date = cellProps.row.original.createdAt.split("T")[0];
          let time = cellProps.row.original.createdAt.split("T")[1];

          return (
            <React.Fragment>
              <div>
                {date} || {time}
              </div>{" "}
            </React.Fragment>
          );
        },
      },
      {
        Header: "Modified By",
        accessor: "modifiedBy",
      },
      {
        Header: "Actions",
        Cell: (cellProps) => {
          return (
            <React.Fragment>
              <div className="d-inline-block"></div>

              <div className="action-modal">
                <img
                  onClick={() => {
                    const data = cellProps.row.original;
                    handleEdit(data);
                  }}
                  src="/edit.png"
                  alt=""
                />
                <img
                  onClick={() => {
                    const data = cellProps.row.original;
                    onClickDelete(data);
                  }}
                  src="/delete.png"
                  alt=""
                />
              </div>
            </React.Fragment>
          );
        },
      },
    ],

    []
  );

  return (
    <div className="elementspage">
      <div className="elementspage__container">
        <h4>Elements</h4>

        <div className="cardtableheader">
          <div className="cardtableheader__container">
            <Search />
            <img src="/filter.png" alt="" />
          </div>

          <div onClick={() => setShowModal(true)} className="create-card">
            create element
            <img src="/plus.png" alt="" />
          </div>
        </div>

        {elementsList.length > 0 ? (
          <TableList
            columns={columns}
            data={elementsList}
            isGlobalFilter={false}
            isAddUserList={false}
            customFetchData={() => 0}
            customTotalSize={4}
            customPageSize={4}
            theadClass="table-light"
          />
        ) : (
          <div className="emptypagecard">
            <img src="/empty.png" alt="" />

            <div className="emptypagecard__bottom">
              <img src="/emdanger.png" alt="" />
              <span>there are no elements to display</span>
            </div>
          </div>
        )}
        <p className="isLoading">{isLoading ? "Please wait" : ""}</p>
      </div>

      <div
        className={`modal ${showModal ? "active" : ""}`}
        id="showModal"
        centered
      >
        <div className="modal__container">
          <div className="modal__head">
            <h4>{isUpdate ? "Update" : "Create"} Element</h4>
          </div>

          <form onSubmit={handleSubmit(handleSave)}>
            <div
              className={`tabPlane ${currentTabPlane === 1 ? "active" : ""}`}
            >
              <div className="row">
                <TextField
                  name="name"
                  label="Name"
                  placeholder="input name"
                  register={register("name", {
                    required: "Please input a name",
                  })}
                  errors={formState.errors}
                />

                <SelectField
                  className="select"
                  name="classificationValueId"
                  label="Element Classification"
                  placeholder="select a classification..."
                  register={register("classificationValueId", {
                    required: "Please select a Classification",
                  })}
                  options={elClassificationOptions}
                  errors={formState.errors}
                />
              </div>

              <div className="row">
                <SelectField
                  className="select"
                  label="Element Category"
                  name="categoryValueId"
                  options={elementCategoryOptions}
                  placeholder="select Element category..."
                  register={register("categoryValueId", {
                    required: "Please select a category",
                  })}
                  errors={formState.errors}
                />

                <SelectField
                  className="select"
                  name="payRunValueId"
                  options={payRunOptions}
                  placeholder="select Payrun..."
                  label="Element payrun"
                  register={register("payRunValueId", {
                    required: "Please select a payrun",
                  })}
                  errors={formState.errors}
                />
              </div>

              <div className="row no-grid">
                <div className="form__group">
                  <Label className="label">Description</Label>

                  <textarea
                    className="select"
                    style={{ width: "100%", height: "10rem" }}
                    name="description"
                    options={[{ label: "one", value: "1", name: "e" }]}
                    placeholder="Input Description"
                    id="description-input"
                    {...register("description", {
                      required: "Please input a description",
                      minLength: 2,
                    })}
                  />
                  {formState.errors && formState.errors.description ? (
                    <p className="fieldError">
                      {formState.errors.description.message}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="row no-grid">
                <div className="form__group">
                  <Label className="label">Reporting Name</Label>

                  <textarea
                    className="select"
                    style={{ width: "100%", height: "10rem" }}
                    name="reporting"
                    options={[{ label: "one", value: "1", name: "e" }]}
                    placeholder="Input Reporting Name"
                    id="Reporting-input"
                    {...register("reportingName", {
                      minLength: 2,
                      required: "PLease input a reporting name",
                    })}
                  />
                  {formState.errors && formState.errors.reportingName ? (
                    <p className="fieldError">
                      {formState.errors.reportingName.message}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="row">
                <div className="form__group">
                  <div
                    onClick={() => setShowModal(false)}
                    className="cancel-button"
                  >
                    Cancel
                  </div>
                </div>
                <div
                  className="form__group"
                  onClick={() => handleNextTabPlane(currentTabPlane + 1)}
                >
                  <div className="next-button">Next</div>
                </div>
              </div>
            </div>

            <div
              className={`tabPlane ${currentTabPlane === 2 ? "active" : ""}`}
            >
              <div className="row">
                <div className="form__group">
                  <Label className="label"> Effective start date</Label>

                  <input
                    className="select"
                    name="effectiveStartDate"
                    type="date"
                    placeholder="select date"
                    {...register("effectiveStartDate", {
                      required: "Please select an Effective start date",
                    })}
                  />

                  {formState.errors.effectiveStartDate ? (
                    <p className="fieldError">
                      {formState.errors.effectiveStartDate.message}
                    </p>
                  ) : null}
                </div>
                <div className="form__group">
                  <Label className="label"> Effective End date</Label>

                  <input
                    className="select"
                    name="effectiveEndDate"
                    type="date"
                    placeholder="select date"
                    {...register("effectiveEndDate", {
                      required: "Please select an Effective End date",
                    })}
                  />
                  {formState.errors.effectiveEndDate ? (
                    <p className="fieldError">
                      {formState.errors.effectiveEndDate.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="row">
                <RadioField
                  label="Proccessing Type"
                  firstRadioName="Open"
                  secondRadioName="Closed"
                  name="processingType"
                  register={register("processingType")}
                  errors={formState.errors}
                />

                <RadioField
                  label="Pay Frequency"
                  firstRadioName="Monthly"
                  secondRadioName="Selected Months"
                  register={register("payFrequency")}
                  name="payFrequency"
                  errors={formState.errors}
                />
              </div>
              <div className="row no-grid">
                <SelectField
                  className="select"
                  label="Selected Pay Months"
                  disabled={isSelectedMonthsFieldDisabled}
                  options={[
                    { name: "January", value: "January" },
                    { name: "February", value: "February" },
                    { name: "March", value: "March" },
                    { name: "April", value: "April" },
                    { name: "May", value: "May" },
                    { name: "June", value: "June" },
                    { name: "July", value: "July" },
                    { name: "August", value: "August" },
                    { name: "September", value: "September" },
                    { name: "October", value: "October" },
                    { name: "November", value: "November" },
                    { name: "December", value: "December" },
                  ]}
                  name="selectedMonths"
                  placeholder="Select"
                  {...register("selectedMonths", { minLength: 2 })}
                  isMulti={true}
                />
              </div>

              <div className="row">
                <RadioField
                  label="Prorate"
                  firstRadioName="Yes"
                  secondRadioName="No"
                  register={register("prorate")}
                  name="prorate"
                  errors={formState.errors}
                />

                <ToggleField
                  label="Prorate"
                  firstRadioName="Yes"
                  secondRadioName="No"
                  register={register("status")}
                  name="status"
                />
              </div>

              <div className="row">
                <div className="form__group">
                  <div onClick={() => toggle()} className="cancel-button">
                    Cancel
                  </div>
                </div>

                <div
                  className="form__group"
                  // onClick={() => handleNextTabPlane(currentTabPlane + 1)}
                >
                  <button
                    type="submit"
                    className="next-button"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "please wait"
                      : isUpdate
                      ? "Update Element"
                      : "Create Element"}
                  </button>
                </div>

                <div className="form__group">
                  <div
                    onClick={() => handleNextTabPlane(currentTabPlane - 1)}
                    className="back-button"
                  >
                    {"<"} Go back
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`tabPlane ${currentTabPlane === 3 ? "active" : ""}`}
            >
              <div className="success">
                <img src="/check.png" alt="" />
                <p>
                  Element has been {isUpdate ? "updated" : "created"}{" "}
                  successfully
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="next-button"
                >
                  Close to continue
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Elements;
