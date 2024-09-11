export const idlFactory = ({ IDL }) => {
  const Drink = IDL.Record({
    'id' : IDL.Nat,
    'name' : IDL.Text,
    'description' : IDL.Opt(IDL.Text),
    'price' : IDL.Float64,
    'ingredients' : IDL.Vec(IDL.Text),
  });
  return IDL.Service({
    'getBartenderStatus' : IDL.Func([], [IDL.Text], ['query']),
    'getDrinkMenu' : IDL.Func([], [IDL.Vec(Drink)], ['query']),
    'orderDrink' : IDL.Func([IDL.Nat], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
