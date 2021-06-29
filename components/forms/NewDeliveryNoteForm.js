import { useState } from "react";
import { useRouter } from "next/router";
import { Controller } from "react-hook-form";
import { DatePicker, FlexboxGrid, SelectPicker } from "rsuite";

import NewDeliveryNoteItemsForm from "./NewDeliveryNotesItemsForm";
import FormErrorMessage from "../common/FormErrorMessage";

export default function NewDeliveryNoteForm({
  token,
  stores,
  sedes,
  applicants,
  errors,
  watch,
  control,
  selectedStoreItems
}) {
  const router = useRouter();
  const { query: { type } } = router;
  const [applicantType, setApplicantType] = useState("");

  return (
    <FlexboxGrid justify="space-between">
      <FlexboxGrid.Item colspan={7}>
        <span className="input-title">Tipo de Nota</span>
        <Controller
          name="noteType"
          control={control}
          defaultValue={type}
          rules={{ required: true }}
          render={(field) => (
            <SelectPicker
              {...field}
              disabled
              className="select-dropdown"
              data={[{ name: "Nota con Retorno", type: "CR" }, { name: "Nota sin Retorno", type: "SR" }]}
              labelKey="name"
              valueKey="type"
              searchable={false}
              cleanable={false}
            />
          )}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7}>
        <span className="input-title">Fecha de Creación</span>
        <Controller
          name="createStamp"
          control={control}
          rules={{ required: true }}
          defaultValue={new Date(Date.now())}
          render={(field) => (
            <DatePicker
              {...field}
              disabled
              className="select-dropdown"
              format="DD-MM-YYYY HH:MM"
              placement="autoVerticalStart"
              cleanable={false}
            />
          )}
        />
      </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={7}>
          <span className="input-title">Fecha de Devolución</span>
          <Controller
            name="returnStamp"
            control={control}
            rules={{ required: type === "CR", validate: type === "CR" ? (value) => (value.getTime() >= watch("createStamp").getTime()) : () => {}}}
            render={(field) => (
              <DatePicker
                {...field}
                disabled={type !== "CR"}
                className="select-dropdown"
                format="DD-MM-YYYY"
                placement="autoVerticalStart"
                cleanable={false}
              />
            )}
          />
          {errors.returnStamp?.type === "required" && <FormErrorMessage message="El campo es requerido" />}
          {errors.returnStamp?.type === "validate" && <FormErrorMessage message="El dia de retorno no puede ser menor al de creación" />}
        </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7} className="not-first-row">
        <span className="input-title">Tipo de Solicitante</span>
        <Controller
          name="applicantType"
          control={control}
          rules={{ required: true }}
          render={(field) => (
            <SelectPicker
              {...field}
              className="select-dropdown"
              value={applicantType}
              onSelect={(value) => setApplicantType(value)}
              data={[{ name: "Persona Natural", type: "applicant" }, { name: "Sede", type: "sede" }]}
              labelKey="name"
              valueKey="type"
              searchable={false}
              cleanable={false}
            />
          )}
        />
        {errors.applicantType && <FormErrorMessage message="El campo es requerido" />}
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7} className="not-first-row">
        <span className="input-title">Solicitante</span>
        <Controller
          name="applicantId"
          control={control}
          rules={{ required: true }}
          render={(field) => (
            <SelectPicker
              {...field}
              className="select-dropdown"
              data={applicantType === "sede" ? sedes : applicants }
              labelKey={applicantType === "sede" ? "name" : "names"}
              valueKey="_id"
              searchable={false}
              cleanable={false}
            />
          )}
        />
        {errors.applicantId && <FormErrorMessage message="El campo es requerido" />}
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7} />
      <NewDeliveryNoteItemsForm stores={stores} token={token} selectedStoreItems={selectedStoreItems} />
      {errors.storeItems && <FormErrorMessage message={errors.storeItems.message} />}
    </FlexboxGrid>
  );
}