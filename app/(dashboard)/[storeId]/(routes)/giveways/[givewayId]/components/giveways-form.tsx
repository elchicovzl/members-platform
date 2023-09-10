"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { CalendarIcon, Trash } from "lucide-react"
import { Giveaway, Store } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { ApiAlert } from "@/components/ui/api-alert"
import { useOrigin } from "@/hooks/use-origin"
import ImageUpload from '@/components/ui/image-upload';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
  qtyTickets: z.string(),
  imageSrc: z.string(),
  giveawayDate: z.date(),
  status: z.string(),
  storeId: z.string(),
  price: z.string()
});

type GivewaysFormValues = z.infer<typeof formSchema>

interface GivewaysFormProps {
  initialData: Giveaway | null;
};

export const GivewaysForm: React.FC<GivewaysFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edite el sorteo' : 'Crea un sorteo';
  const description = initialData ? 'Edite el sorteo para tu sitio web.' : 'Crea un nuevo sorteo para tu sitio web';
  const toastMessage = initialData ? 'Sorteo actualizado.' : 'Sorteo creado.';
  const action = initialData ? 'Guardar cambios' : 'Crear';

  const form = useForm<GivewaysFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      qtyTickets: '',
      imageSrc: '',
      giveawayDate: '',
      status: '',
      storeId: '',
      price:'0'
    }
  });

  const onSubmit = async (data: GivewaysFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/giveways/${params.givewayId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/giveways`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/giveways`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Algo malo ocurrió.');
    } finally {
      setLoading(false);
    }
  };
  
  const onDelete = async () => {
    try {
      setLoading(true);
      //await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push('/');
      toast.success('Sorteo eliminado.');
    } catch (error: any) {
      toast.error('se encontró un error.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
    <AlertModal 
      isOpen={open} 
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
    />
     <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <FormField
                  control={form.control}
                  name="imageSrc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagen para el sorteo</FormLabel>
                      <FormControl>
                        <ImageUpload 
                          value={field.value ? [field.value] : []} 
                          disabled={loading} 
                          onChange={(url) => field.onChange(url)}
                          onRemove={() => field.onChange('')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="md:grid md:grid-cols-3 gap-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                              <Input disabled={loading} placeholder="nombre del sorteo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                  />
                </div>
                <div className="md:grid md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agrega una descripcion</FormLabel>
                          <FormControl>
                              <Textarea disabled={loading} rows={8} placeholder="descripcion del sorteo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                  />
                </div>
                <div className="md:grid md:grid-cols-3 gap-8">
                  <FormField
                    control={form.control}
                    name="giveawayDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Fecha del sorteo</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>Elige una fecha</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              locale={es}
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          fecha en la que se dara el sorteo.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="qtyTickets"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numero de boletas</FormLabel>
                          <FormControl>
                              <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <SelectTrigger className="">
                                  <SelectValue defaultValue={field.value} placeholder="Seleccione una cantidad" />
                                </SelectTrigger>
                                <SelectContent onSelect={field.onChange}>
                                  <SelectItem value="100">100</SelectItem>
                                  <SelectItem value="1000">1000</SelectItem>
                                </SelectContent>
                              </Select>
                          </FormControl>
                          <FormDescription>
                            Numero de boletas que se venderan en el sorteo.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                    )}
                  />
                </div>
                <div className="md:grid md:grid-cols-3 gap-8">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio de la boleta</FormLabel>
                          <FormControl>
                            <Input disabled={loading} placeholder="precio del boleto" {...field} />
                          </FormControl>
                          <FormDescription>
                            Precio de venta por unidad de las boletas.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                    )}
                  />
                </div>
                <Separator />
                <Button disabled={loading} className="ml-auto" type="submit">
                    {action}
                </Button>
            </form>
        </Form>
      <Separator />
      <ApiAlert 
        title="NEXT_PUBLIC_API_URL" 
        variant="public" 
        description={`${origin}/api/${params.storeId}`}
      />
    </>
  );
};