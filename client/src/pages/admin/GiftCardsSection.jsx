import { Card, Input } from "./AdminControls";

const GiftCardsSection = ({
  giftCardForm = {},
  giftCards = [],
  onGiftCardFieldChange = () => {},
  onGiftCardSubmit = () => {},
  onRedeemGiftCard = () => {},
}) => (
  <div className="space-y-6">
    <Card>
      <h2 className="text-lg font-semibold mb-4">Gift Card</h2>
      <form onSubmit={onGiftCardSubmit} className="grid md:grid-cols-2 gap-4">
        <Input
          label="Code"
          value={giftCardForm.code || ""}
          onChange={(value) => onGiftCardFieldChange("code", value)}
        />
        <Input
          label="Initial Balance"
          type="number"
          value={giftCardForm.initialBalance || ""}
          onChange={(value) => onGiftCardFieldChange("initialBalance", value)}
        />
        <Input
          label="Expires At"
          type="date"
          value={giftCardForm.expiresAt || ""}
          onChange={(value) => onGiftCardFieldChange("expiresAt", value)}
        />
        <div className="md:col-span-2">
          <button className="bg-black text-white px-6 py-3 rounded-xl font-medium">
            Create Gift Card
          </button>
        </div>
      </form>
    </Card>

    <Card>
      <h2 className="text-lg font-semibold mb-4">Gift Cards</h2>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 uppercase text-xs tracking-widest">
            <th className="py-2">Code</th>
            <th className="py-2">Balance</th>
            <th className="py-2">Active</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {giftCards.map((card) => (
            <tr key={card._id} className="border-t">
              <td className="py-3">{card.code}</td>
              <td className="py-3">INR {card.balance}</td>
              <td className="py-3">{card.isActive ? "Yes" : "No"}</td>
              <td className="py-3">
                <button
                  className="text-xs uppercase tracking-widest text-blue-500"
                  onClick={() => onRedeemGiftCard(card.code)}
                >
                  Redeem
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

export default GiftCardsSection;
