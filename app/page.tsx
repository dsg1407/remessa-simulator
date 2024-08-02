'use client'

import { useEffect, useState } from 'react'
import {
  Question,
  Coins,
  Percent,
  City,
  LinkedinLogo,
} from '@phosphor-icons/react/dist/ssr'
import dayjs from 'dayjs'

import axios from 'axios'

import Input from '@/components/Input'
import Text from '@/components/Text'
import FormGroup from '@/components/FormGroup'
import SectionMenu from '@/components/SectionMenu'

type ResponseData = {
  cotacaoCompra: number
  cotacaoVenda: number
  dataHoraCotacao: string
  tipoBoletim: string
}
type DataProps = {
  data: {
    value: ResponseData[]
  }
}

export default function Home() {
  const [showHelpMenu, setShowHelpMenu] = useState(false)
  const [exchangeRate, setExchangeRate] = useState<ResponseData>({
    cotacaoCompra: 0,
    cotacaoVenda: 0,
    dataHoraCotacao: '',
    tipoBoletim: '',
  })

  const [BRLValue, setBRLValue] = useState('')
  const [USDValue, setUSDValue] = useState('')
  const [IIValue, setIIValue] = useState('')
  const [INSSValue, setINSSValue] = useState('')
  const [discount, setDiscount] = useState('')
  const [finalValue, setFinalValue] = useState('')

  const INSS_TAX = 0.17
  const LOW_II_TAX = 0.2
  const HIGH_II_TAX = 0.6
  const TOP_DISCOUNT = 20

  async function getCurrencyConversion() {
    try {
      const today = dayjs()
      const yesterday = today.subtract(1, 'day')

      const { data } = (await axios.get(
        `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodoFechamento(codigoMoeda=@codigoMoeda,dataInicialCotacao=@dataInicialCotacao,dataFinalCotacao=@dataFinalCotacao)?@codigoMoeda='USD'&@dataInicialCotacao='${yesterday.format(
          'MM-DD-YYYY'
        )}'&@dataFinalCotacao='${today.format('MM-DD-YYYY')}'&$format=json`
      )) as DataProps

      const newExchangeRate = data.value[0]

      setExchangeRate(newExchangeRate)
    } catch (error) {
      console.log(error)
    }
  }

  function handleBRLValueChange(value: string) {
    const newValue = value.replace(/[a-z]/gi, '')

    setUSDValue((Number(newValue) / exchangeRate.cotacaoCompra).toFixed(2))
    setBRLValue(newValue)
  }

  function handleUSDValueChange(value: string) {
    const newValue = value.replace(/[a-z]/gi, '')

    setUSDValue(newValue)
    setBRLValue((Number(newValue) * exchangeRate.cotacaoCompra).toFixed(2))
  }

  function resultCalculate() {
    const importTaxValue =
      Number(USDValue) > 50
        ? Number(BRLValue) * HIGH_II_TAX
        : Number(BRLValue) * LOW_II_TAX

    const discountValue =
      Number(USDValue) > 50 && Number(USDValue) <= 3000
        ? TOP_DISCOUNT * exchangeRate.cotacaoCompra
        : 0

    const INSSTaxValue =
      (Number(BRLValue) + (importTaxValue - discountValue)) / (1 - INSS_TAX) -
      Number(BRLValue) -
      importTaxValue +
      discountValue

    const finalResult =
      Number(BRLValue) + importTaxValue + INSSTaxValue - discountValue

    setIIValue(importTaxValue.toString())
    setINSSValue(INSSTaxValue.toString())
    setDiscount(discountValue.toString())
    setFinalValue(finalResult.toString())
  }

  useEffect(() => {
    getCurrencyConversion()
  }, [])

  useEffect(() => {
    resultCalculate()
  }, [BRLValue])

  return (
    <>
      <main className="min-h-screen md:max-h-screen overflow-y-hidden md:overflow-hidden bg-neutral-100 px-9 py-8 flex flex-col items-start md:items-center justify-center">
        <div
          className={`max-w-screen-xl w-full flex items-stretch justify-center md:flex-row flex-col transition-all ${
            showHelpMenu && 'gap-6'
          }`}
        >
          <section className="flex flex-1 flex-col items-start justify-center w-full">
            <img
              src="/logo.svg"
              alt="Logo with an image of a money tree, a bag of money and the name of the page."
              className="w-full max-w-2xl"
            />

            <div className="flex flex-col items-center md:items-start w-full py-5 md:pt-5 md:pb-12">
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Text heading>Simulação</Text>
                  <button
                    className="cursor-pointer hover:opacity-50"
                    onClick={() => {
                      setShowHelpMenu((state) => !state)
                    }}
                  >
                    <Question size={26} />
                  </button>
                </div>
                <div
                  className="flex flex-col gap-1 items-end"
                  title={`Atualizado em ${dayjs(
                    exchangeRate.dataHoraCotacao
                  ).format('DD/MM/YYYY HH:MM')}`}
                >
                  <p
                    className="text-sm font-nunito"
                    title={`Atualizado em ${dayjs(
                      exchangeRate.dataHoraCotacao
                    ).format('DD/MM/YYYY HH:MM')}`}
                  >
                    Cotação dólar hoje:
                  </p>
                  <span
                    className="font-nunito font-bold flex items-center gap-1"
                    title={`Atualizado em ${dayjs(
                      exchangeRate.dataHoraCotacao
                    ).format('DD/MM/YYYY HH:MM')}`}
                  >
                    {exchangeRate.cotacaoCompra.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                    <Coins size={22} className="text-yellow-600" />
                  </span>
                </div>
              </div>
              <FormGroup>
                <Input
                  type="number"
                  step={0.01}
                  name="brl"
                  currency="R$"
                  label="Valor da compra e frete em reais"
                  placeholder="Digite o valor da compra em reais"
                  value={BRLValue}
                  onChange={(item) => handleBRLValueChange(item.target.value)}
                />
                <Input
                  type="number"
                  step={0.01}
                  name="usd"
                  currency="$"
                  label="Valor em dólar"
                  placeholder="Digite o valor da compra em dólares"
                  info="Considere o valor do frete"
                  value={USDValue}
                  onChange={(item) => handleUSDValueChange(item.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Input
                  name="importacao"
                  currency="R$"
                  label="Imposto importação"
                  info={`Taxa de ${
                    Number(USDValue) > 50
                      ? HIGH_II_TAX.toLocaleString('pt-br', {
                          style: 'percent',
                        })
                      : LOW_II_TAX.toLocaleString('pt-br', { style: 'percent' })
                  }`}
                  value={Number(IIValue).toLocaleString('pt-br', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  className={`${Number(BRLValue) > 0 && 'text-red-500'}`}
                  disabled
                />
                <Input
                  name="descontos"
                  currency="R$"
                  label="Descontos"
                  info={
                    Number(USDValue) > 50 && Number(USDValue) <= 3000
                      ? 'Desconto de 20 dólares'
                      : 'Sem descontos'
                  }
                  value={Number(discount).toLocaleString('pt-br', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  className={`${Number(BRLValue) > 0 && 'text-green-600'}`}
                  disabled
                />
              </FormGroup>

              <FormGroup>
                <Input
                  name="inss"
                  currency="R$"
                  label="INSS"
                  info={`Taxa de ${INSS_TAX.toLocaleString('pt-br', {
                    style: 'percent',
                  })}`}
                  value={Number(INSSValue).toLocaleString('pt-br', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  className={`${Number(BRLValue) > 0 && 'text-red-500'}`}
                  disabled
                />

                <div className="hidden md:flex md:w-full md:flex-1">
                  {Number(BRLValue) > 0 && (
                    <div className="w-full my-auto flex flex-col items-center gap-2">
                      <Text className="font-nunito text-center px-16 border-b border-b-zinc-400 text-sm text-zinc-800 font-semibold flex items-center gap-2">
                        <City size={24} weight="regular" className="mb-1" />
                        Impostos totais
                      </Text>
                      <div className="w-full flex items-center justify-center">
                        <Text className="px-6 py-1 font-nunito font-bold text-sm flex items-center gap-2 text-red-400">
                          <Coins
                            size={24}
                            className="text-zinc-800"
                            weight="thin"
                          />
                          {(
                            Number(finalValue) - Number(BRLValue)
                          ).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Text>
                        <Text className="px-6 py-1 font-nunito font-bold text-sm flex items-center gap-1 text-red-400">
                          <Percent
                            size={20}
                            className="text-zinc-800"
                            weight="light"
                          />

                          {(
                            Number(finalValue) / Number(BRLValue) -
                            1
                          ).toLocaleString('pt-BR', {
                            style: 'percent',
                            maximumFractionDigits: 2,
                          })}
                        </Text>
                      </div>
                    </div>
                  )}
                </div>
              </FormGroup>

              <FormGroup>
                <Input
                  name="valor-final"
                  currency="R$"
                  label="Valor final a pagar"
                  value={Number(finalValue).toLocaleString('pt-br', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  result={Number(BRLValue) > 0 ? true : false}
                  disabled
                />
              </FormGroup>
            </div>
          </section>

          <section
            className={`flex md:max-w-[35%] items-stretch w-full transition-all duration-300${
              !showHelpMenu &&
              'md:flex md:-ml-[35%] md:translate-x-96 md:opacity-0'
            }`}
          >
            <div className="md:max-h-[80vh] w-full py-7 pl-7 pr-7 md:pr-0 md:ml-5 rounded-2xl bg-zinc-200 text-sm flex flex-col ">
              <Text className="text-2xl font-nunito font-extrabold text-center mb-3 uppercase md:mr-7">
                Remessa conforme
              </Text>

              <div className="font-nunito flex flex-col gap-3 md:overflow-y-scroll snap-start scroll-smooth md:mr-[14px] custom-scrollbar">
                <Text className="text-justify">
                  O Programa Remessa Conforme é um programa criado pela Receita
                  Federal que certifica empresas de comércio eletrônico que
                  seguirão regras de importação diferenciadas. Comprando nesses
                  sites, o comprador paga os impostos antecipadamente, no ato da
                  compra dos produtos. Com a informação chegando mais rápido à
                  Receita Federal, a ideia principal é que a encomenda fique
                  menos tempo nas alfândegas e seja entregue mais rapidamente.
                </Text>

                <SectionMenu
                  title="Regras gerais"
                  texts={[
                    'A regra geral para produtos importados em sites de compras internacionais é que sejam tributados da seguinte forma:',
                    '– 60% de Imposto de Importação (I.I.)',
                    '– 17% de Imposto sobre a Circulação de Mercadorias e Serviços (ICMS).',
                    'As compras internacionais estão sempre sujeitas à cobrança de impostos.',
                  ]}
                />

                <SectionMenu
                  title="Compras até 50 dólares"
                  texts={[
                    'Com a nova regra, para compras de até 50 dólares, o Imposto de Importação aumentou de 0% para 20%.',
                    'Com isso, o valor total a pagar pela compra inclui o valor do produto, considerando o frete, o Imposto de Importação e o INSS.',
                  ]}
                  example="Valor a pagar = Valor Produto + Imposto Importação + INSS"
                />
                <SectionMenu
                  title="Compras acima de 50 dólares"
                  texts={[
                    'Para compras acima de 50 dólares, o Imposto de Importação é de 60%, com um desconto de 20 dólares.',
                    'O valor total a pagar pela compra deve incluir o valor do produto, considerando o frete, o Imposto de Importação (com o desconto aplicado), e o INSS.',
                  ]}
                  example="Valor a pagar = Valor Produto + (Imposto Importação - Descontos) + INSS"
                />
                <SectionMenu
                  title="Cálculo INSS"
                  texts={[
                    'O cálculo do INSS, diferentemente do Imposto de Importação, é feito "por dentro", resultando em uma alíquota efetiva maior que a nominal.',
                    'Assim, para a alíquota nominal de 17% atualmente aplicada, a alíquota efetivamente paga é de 20,48%.',
                    'Para o cálculo do INSS deve-se considerar o valor do produto já aplicado o Imposto de Importação',
                  ]}
                  example="%Efetivo = Alíquota nominal / (1 - Alíquota nominal)"
                />
                <SectionMenu
                  title="Descontos"
                  texts={[
                    'Com a nova regra, compras acima de 50 dólares recebem um desconto de 20 dólares no Imposto de Importação, aplicado para compras de até 3 mil dólares.',
                    'Diferente da regra anterior, onde a alíquota total de impostos era de 92,77% para valores a partir de 50,01 dólares, a nova alíquota é variável, aumentando progressivamente para cada dólar adicional gasto, até o limite de 92,77%.',
                  ]}
                />
                <SectionMenu
                  title="Links Úteis"
                  texts={['Abaixo seguem alguns links úteis:']}
                  links={[
                    {
                      name: 'Regras Programa - Receita Federal',
                      url: 'https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/manuais/remessas-postal-e-expressa/programa-remessa-conforme-o-que-e-como-funciona?_authenticator=0d6f9216d41f9c44f15adfd7228ec6843dbfd24e',
                    },
                    {
                      name: 'Empresas Cadastradas',
                      url: 'https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/manuais/remessas-postal-e-expressa/empresas-certificadas-no-programa-remessa-conforme-prc',
                    },
                  ]}
                />
              </div>
            </div>
          </section>
        </div>
        <footer className="w-full flex items-center justify-center py-2 mt-5 md:-mt-5 md:translate-y-5 md:py-0">
          <a
            href="https://www.linkedin.com/in/dsg1407/"
            target="_blank"
            className="text-xs font-nunito text-zinc-600 hover:scale-105 hover:opacity-75 transition flex items-center w-fit"
          >
            <LinkedinLogo
              size={22}
              weight="fill"
              className="inline text-sky-600"
            />
            Daniel Gonçalves | @dsg1407
          </a>
        </footer>
      </main>
      <div
        className={`absolute right-3 top-3 rounded-xl p-1 bg-white transition hover:brightness-90`}
      >
        <a
          href="https://www.buymeacoffee.com/dsg1407"
          target="_blank"
          title="Buy me a Coffee!!"
        >
          <img
            className="w-10 md:w-16 hover:scale-95"
            src="./buy-coffee-qr.png"
          />
        </a>
      </div>
    </>
  )
}
