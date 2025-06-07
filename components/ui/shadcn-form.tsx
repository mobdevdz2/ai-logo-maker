import {
    Form,
    IArrayDefaultProps,
    IBooleanDefaultProps,
    IEnumDefaultProps,
    INumberDefaultProps,
    IObjectDefaultProps,
    IStringDefaultProps,
    FormSchema,
    IFormProps,
  } from "@zodform/core";
  import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Form as ShadcnForm,
  } from "@/components/ui/form"; // Shadcn UI Form components
  import { Input } from "@/components/ui/input"; // Shadcn UI Input
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Shadcn UI Select
  import { Checkbox } from "@/components/ui/checkbox"; // Shadcn UI Checkbox
  import { Button } from "@/components/ui/button"; // Shadcn UI Button
  import { Label } from "@/components/ui/label"; // Shadcn UI Label
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
  
  // String Input Component
  export function ShadcnString({
    autoFocus,
    defaultValue,
    value,
    errorMessage,
    name,
    label,
    isRequired,
    onChange,
    description,
  }: IStringDefaultProps & { label: string }) {
    return (
      <FormField defaultValue={defaultValue} name= {name} render={({}) => ( <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            autoFocus={autoFocus}
            defaultValue={defaultValue}
            value={value ?? ""}
            name={name}
            required={isRequired}
            onChange={(e) => onChange(e.target.value)}
            placeholder={label}
          />
        </FormControl>
        {(errorMessage || description) && (
          <>
            {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
            {description && !errorMessage && (
              <FormDescription>{description}</FormDescription>
            )}
          </>
        )}
      </FormItem>)} />
     
    );
  }
  
  // Object (Group) Component
  export function ShadcnObject({ title, children, description }: IObjectDefaultProps) {
    return (
      <div className="space-y-4">
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        <div className="space-y-4">{children}</div>
      </div>
    );
  }
  
  // Boolean (Checkbox) Component
  export function ShadcnBoolean({
    autoFocus,
    label,
    onChange,
    description,
    errorMessage,
    defaultValue,
    value,
    name,
  }: IBooleanDefaultProps) {
    return (
      <FormItem>
        <div className="flex items-center space-x-2">
          <FormControl>
            <Checkbox
              checked={value ?? defaultValue ?? false}
              autoFocus={autoFocus}
              name={name}
              onCheckedChange={(checked) => onChange(checked === true)}
            />
          </FormControl>
          <FormLabel>{label}</FormLabel>
        </div>
        {(errorMessage || description) && (
          <>
            {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
            {description && !errorMessage && (
              <FormDescription>{description}</FormDescription>
            )}
          </>
        )}
      </FormItem>
    );
  }
  
  // Enum (Select) Component
  export function ShadcnEnum({
    autoFocus,
    value,
    errorMessage,
    description,
    isRequired,
    onChange,
    label,
    name,
    options,
    optionLabels,
  }: IEnumDefaultProps) {
    return (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <Select
          value={value}
          onValueChange={onChange}
          name={name}
          required={isRequired}
          disabled={autoFocus ? false : undefined}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {optionLabels?.[option] ?? option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(errorMessage || description) && (
          <>
            {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
            {description && !errorMessage && (
              <FormDescription>{description}</FormDescription>
            )}
          </>
        )}
      </FormItem>
    );
  }
  
  // Number Input Component
  export function ShadcnNumber({
    autoFocus,
    label,
    isRequired,
    onChange,
    description,
    errorMessage,
    value,
    name,
  }: INumberDefaultProps & { label: string }) {
    return (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            type="number"
            autoFocus={autoFocus}
            value={value ?? ""}
            name={name}
            required={isRequired}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            placeholder={label}
          />
        </FormControl>
        {(errorMessage || description) && (
          <>
            {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
            {description && !errorMessage && (
              <FormDescription>{description}</FormDescription>
            )}
          </>
        )}
      </FormItem>
    );
  }
  
  // Array Component
  export function ShadcnArray({ children, description, title, onRemove, onAdd }: IArrayDefaultProps) {
    return (
      <div className="space-y-4">
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        <div className="space-y-4">
          {children.map((child, index) => (
            <div
              key={index}
              className="p-4 bg-secondary rounded-md space-y-2"
            >
              {child}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemove(index)}
                className="mt-2"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={onAdd}>
          Add
        </Button>
      </div>
    );
  }
  
  // Custom Shadcn Form Component
  export function FormGenerator<Schema extends FormSchema>(
    props: Omit<IFormProps<Schema>, "components">
  ) {
    const form = useForm({
      defaultValues: props.defaultValues,
      resolver: zodResolver(props.schema),
    })
    return (
      <ShadcnForm {...form}>
        <form>
        
        </form>
      
      </ShadcnForm>
    );
  }