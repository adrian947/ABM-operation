import React, { useState } from "react";
import clientAxios from "../../axios/clientAxios";
import { changeDate } from "../../helpers/moment";
import { Spinner } from "../spinner";
import { tokenAuth } from "./../../axios/authTokenHeaders";

export const MovementsCard = ({
  movement,
  setNewMovement,
  setUpdateMovement,
  updateMovement,
}) => {
  const { amount, concepts, created_at, type, id } = movement;

  const newDate = changeDate(created_at);

  const [modal, setModal] = useState(false);
  const [conceptsForm, setConceptsForm] = useState(concepts);
  const [amountForm, setAmountForm] = useState(amount);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const { data } = await clientAxios.delete(`movements/${id}`, tokenAuth());
      if (data) {
        setLoading(false);
      }
      setNewMovement(data.movement);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  const handleUpdate = (id) => {
    setModal(true);
  };

  const handleSubmit = async (e, id) => {
    e.preventDefault();

    try {
      setLoading(true);
      const resp = await clientAxios.put(
        `movements/${id}`,
        { concepts: conceptsForm, amount: amountForm },
        tokenAuth()
      );

      setUpdateMovement(!updateMovement);
      if (resp) {
        setLoading(false);
      }
      setModal(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  return (
    <div className='container__card'>
      {!modal ? (
        <>
          <div>
            <h3>Concept: {concepts}</h3>
            <h3>Amount: $ {amount}</h3>
            <p className={type === "entry" ? "typeEntry" : " typeEgress"}>
              Type: {type}
            </p>
            <p>{newDate}</p>
          </div>
          <div>
            {loading ? (
              <Spinner />
            ) : (
              <>
                <button
                  onClick={() => handleDelete(id)}
                  className='buttonDelete'
                >
                  Delete
                </button>
                <button
                  onClick={() => handleUpdate(id)}
                  className='buttonUpdate'
                >
                  UPDATE
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <form className='formFlex' onSubmit={(e) => handleSubmit(e, id)}>
            <h2 className='titleAuth titleUpdate'>Update Movement</h2>
            <div className='inputFlex'>
              <input
                placeholder='Concepts'
                className='input'
                onChange={(e) => setConceptsForm(e.target.value)}
                value={conceptsForm}
                name='concepts'
                type='text'
                maxLength={16}
              />
              <input
                placeholder='Amount'
                className='input'
                onChange={(e) => setAmountForm(e.target.value)}
                value={amountForm}
                name='amount'
                type='number'
              />
            </div>
            <div className='buttonsUpdate'>
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <input
                    type='submit'
                    value='Apply movement'
                    className='buttonUpdate'
                  />
                  <input
                    type='button'
                    value='back'
                    className='buttonUpdate'
                    onClick={() => setModal(false)}
                  />
                </>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
};
