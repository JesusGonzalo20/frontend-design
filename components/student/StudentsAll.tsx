import React, { useState } from 'react';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import tokenConfig, { URL } from '@/components/utils/format/tokenConfig';
import Modal from '../share/ModalAdmin';
import { useRouteData } from '@/hooks/hooks';
// Importamos un ícono de advertencia (puedes cambiarlo por otro si prefieres)
import { AiOutlineWarning } from 'react-icons/ai';

interface CreateStudentFormProps {
  onCloseModal: () => void;
  onCreateSuccess: () => void;
}

type StudentFormData = {
  excelFile: FileList;
};

const CreateStudentExcel: React.FC<CreateStudentFormProps> = ({ onCloseModal, onCreateSuccess }) => {
  const { register, handleSubmit } = useForm<StudentFormData>();
  const [modalOpen, setModalOpen] = useState(false);
  const [duplicateCodes, setDuplicateCodes] = useState<string[]>([]);
  const [insertionSuccess, setInsertionSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const token = useRouteData("parameter") as string;
  const validToken: string = token || '';

  const onSubmit: SubmitHandler<StudentFormData> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('excelFile', data.excelFile[0]);

      const response = await axios.post(
        `${URL()}/students/many`,
        formData,
        tokenConfig(validToken)
      );

      // Verifica si el backend envía info sobre códigos duplicados
      if (response.data?.errorContent?.duplicateCode) {
        setDuplicateCodes(response.data.errorContent.duplicateCode);
        setInsertionSuccess(false);
        setErrorMessage(null); // No es un error genérico, sino duplicados
        setModalOpen(true);
      } else {
        // Inserción exitosa
        setInsertionSuccess(true);
        setDuplicateCodes([]);
        setErrorMessage(null);
        setModalOpen(true);
        onCreateSuccess();
      }
    } catch (error: any) {
      // Aquí lees el mensaje exacto que venga del backend
      // Supongamos que el backend te envía un objeto con { message: 'Duplicado en la fila 2 y 3' }
      // o un string directamente. Usamos un fallback por si no viene nada.
      const backendMessage = error?.response?.data?.message || 'Se encuentran códigos duplicados en el archivo. corregir y volver a intentar';
      setErrorMessage(backendMessage);
      setModalOpen(true);
      console.error('Error al crear estudiantes:', error);
    } finally {
      // No cerramos el modal automáticamente para que el usuario pueda ver el mensaje con calma.
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setDuplicateCodes([]);
    setInsertionSuccess(false);
    setErrorMessage(null);
    onCloseModal();
  };

  return (
    <Modal open={true} onClose={closeModal}>
      <div className="max-w-screen-lg mx-auto border p-4 rounded-xl">
        <h1 className="text-sm text-center font-bold bg-[#006eb0] text-gray-200 border p-2 rounded-lg mb-4 uppercase">
          Agregar estudiantes desde Excel
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="grid grid-cols-2 uppercase text-gray-600 md:grid-cols-2 gap-2"
        >
          <div className="mb-4 text-xs col-span-full md:col-span-2">
            <label className="block font-bold">Archivo Excel: </label>
            <input
              {...register('excelFile')}
              type="file"
              accept=".xls, .xlsx"
              className="border rounded-lg p-3 w-full"
            />
          </div>
          <div className="col-span-full flex justify-center">
            <button
              type="submit"
              className="w-auto uppercase text-sm font-bold sm:w-auto bg-[#006eb0] text-white rounded-lg px-4 py-2 hover:bg-blue-700"
            >
              Agregar
            </button>
          </div>
        </form>

        {/* Modal secundario para mensajes de éxito, error o duplicados */}
        {modalOpen && (
          <Modal open={modalOpen} onClose={closeModal}>
            <div className="p-3 rounded-xl text-[#006eb0] ">
              {/* Caso: Error genérico proveniente del backend */}
              {errorMessage && (
                <div className=" flex items-start bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                  <AiOutlineWarning className="text-red-500 text-2xl mr-3 mt-1" />
                  <div>
                    <p className="font-bold">¡Error! aqui</p>
                    <p className="text-sm">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Caso: Inserción exitosa */}
              {insertionSuccess && !errorMessage && (
                <p className="flex justify-center text-green-700 font-bold bg-green-100 border border-green-400 px-4 py-3 rounded">
                  Inserción exitosa.
                </p>
              )}

              {/* Caso: Códigos duplicados */}
              {duplicateCodes.length > 0 && !errorMessage && (
                <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded ">
                  <p className="font-bold mb-2">Error: Códigos duplicados</p>
                  <ul className="list-disc list-inside">
                    {duplicateCodes.map((code, index) => (
                      <li key={index}>{code}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Modal>
        )}
      </div>
    </Modal>
  );
};

export default CreateStudentExcel;
